import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { Icon, Layout, Menu } from 'antd';
import routes from './router';
import styles from './App.module.css';

const { ipcRenderer } = window.require('electron');
const child_process = window.require('child_process');

const { Sider, Content } = Layout;


class App extends Component {
  constructor(props) {
    super(props);
    this.getDefaultPlan = this.getDefaultPlan.bind(this);
    this.defaultPlanHaveBeenDel = this.defaultPlanHaveBeenDel.bind(this);
    this.updateDefaultPlan = this.updateDefaultPlan.bind(this);
    this.setTimer = this.setTimer.bind(this);

    const autoStart = window.localStorage.getItem('autoStart');
    if (!autoStart) {  // 如果这个字段没有值
      ipcRenderer.send('enableAutoStart');
      window.localStorage.setItem('autoStart', true + '');
    }

    const defaultPlanID = window.localStorage.getItem('defaultPlanID') || '';
    const plans = JSON.parse(window.localStorage.getItem('plans')) || [];
    const defaultPlan = this.getDefaultPlan(defaultPlanID, plans);
    this.state = {
      plans,
      defaultPlan,
      timer: null
    };
  }

  componentDidMount() {
    this.setTimer();

    ipcRenderer.send('appStart');
    ipcRenderer.on('pushPath', (event, arg) => {
      this.props.history.push(arg);
    });
  }

  setTimer() {
    this.setState({
      timer: setInterval(() => {
        if (!this.state.defaultPlan) {
          clearInterval(this.state.timer);
          return null;
        }
        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes();
        const planTime = this.state.defaultPlan.time.split(':');
        if (hours > parseInt(planTime[0]) || mins > parseInt(planTime[1])) {
          return clearInterval(this.state.timer);
        }
        const time = `${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}`;
        if (this.state.defaultPlan.time === time) {
          clearInterval(this.state.timer);
          this.startDefaultPlan();
        }
      }, 20 * 1000)
    });
  }

  defaultPlanHaveBeenDel() {
    clearInterval(this.state.timer);
  }

  updateDefaultPlan() {
    const defaultPlanID = window.localStorage.getItem('defaultPlanID') || '';
    const plans = JSON.parse(window.localStorage.getItem('plans')) || [];
    this.setState({
      defaultPlan: this.getDefaultPlan(defaultPlanID, plans)
    });
    setTimeout(() => {
      this.setTimer();
    });
  }

  getDefaultPlan(defaultPlanID, plans) {
    let defaultPlan = {};
    if (defaultPlanID && plans.length > 0) {
      plans.some(plan => {
        if (plan.id === defaultPlanID) {
          defaultPlan = plan;
          return true;
        }
        return false;
      });
    }
    return defaultPlan;
  }

  startDefaultPlan() {
    this.state.defaultPlan.appList.forEach(app => {
      child_process.execFile(JSON.parse(app).path, (error, stdout, stderr) => {
        if (error) {
          console.log('error:' + error);
        }
      });
    });
  }

  render() {
    return (
      <Router>
        <div className={styles.App}>
          <Layout>
            <Sider theme="light">
              <Menu
                mode="inline"
                selectedKeys={[this.props.location.pathname]}
                style={{ height: '100vh' }}>
                {routes.map((route, index) => (
                  <Menu.Item key={route.path}>
                    <Icon type={route.icon} />
                    <Link to={route.path} style={{ display: 'inline-block' }}>{route.label}</Link>
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>

            <Layout className={styles.view}>
              <Content>
                <Switch>
                  {routes.map((route, index) => {
                    const RouteComponent = ({ component: Component, ...rest }) => (
                      <Route {...rest} render={props => (
                        <Component
                          {...props}
                          defaultPlanHaveBeenDel={this.defaultPlanHaveBeenDel}
                          updateDefaultPlan={this.updateDefaultPlan} />
                      )} />
                    );
                    return (
                      <RouteComponent
                        key={route.name}
                        path={route.path}
                        exact={route.exact}
                        component={route.component}
                      />
                    )
                  })}
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </div>
      </Router>
    );
  }
}

export default withRouter(App);