import React, { Component } from 'react';
import { Button, Card, Col, Empty, Modal, message, Row } from 'antd';
import styles from './index.module.css';

message.config({
  duration: 1.5,
  maxCount: 3,
});

const confirm = Modal.confirm;

class Application extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.selectFile = this.selectFile.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.state = {
      apps: JSON.parse(window.localStorage.getItem('apps')) || []
    };
  }

  selectFile() {
    this.fileInput.current.click();
  }

  fileChange() {
    const file = this.fileInput.current.files[0];
    const haveThisApp = this.state.apps.some(app => {
      if (app.name === file.name && app.path === file.path) {
        return true;
      }
      return false;
    });
    if (!haveThisApp) {
      this.setState({
        apps: [
          ...this.state.apps,
          {
            name: file.name,
            path: file.path
          }
        ]
      });
      setTimeout(() => {
        window.localStorage.setItem('apps', JSON.stringify(this.state.apps));
        message.success('添加成功');
      }, 0);
    } else {
      message.error('列表中已存在该项');
    }
  }

  delApp(app, e) {
    const that = this;
    confirm({
      title: '确认信息',
      content: '是否删除该项？',
      onOk() {
        const apps = that.state.apps.filter(a => {
          return a.name !== app.name && a.path !== app.name;
        });
        that.setState({
          apps
        });
        window.localStorage.setItem('apps', JSON.stringify(apps));
        const plans = JSON.parse(window.localStorage.getItem('plans')) || [];
        const newPlans = plans.map(plan => {
          const newAppList = plan.appList.filter(a => {
            const application = JSON.parse(a);
            return application.name !== app.name && application.path !== app.path;
          });

          return {
            id: plan.id,
            name: plan.name,
            appList: newAppList,
            time: plan.time
          }
        });
        window.localStorage.setItem('plans', JSON.stringify(newPlans));
        that.props.updateDefaultPlan();
        setTimeout(() => {
          message.success('删除成功');
        }, 0);
      },
      onCancel() { },
    });
  }

  render() {
    return (
      <div>
        <Row className={styles.header}>
          <Col span={6} className={styles.title}>
            <span>应用列表</span>
          </Col>
          <Col span={18} className={styles.control}>
            <input
              type="file"
              ref={this.fileInput}
              onChange={this.fileChange}
              style={{ display: 'none' }} />
            <Button type="primary" onClick={this.selectFile}>添加应用</Button>
          </Col>
        </Row>
        <Row className={styles['app-list']}>
          {this.state.apps.length > 0 ? (
            this.state.apps.map(app => (
              <Card hoverable className={styles.app} key={app.path}>
                <Row className={styles['app-name']}>
                  <span style={{ float: 'left' }}>{app.name}</span>
                  <Button type="danger" ghost onClick={this.delApp.bind(this, app)}>删除</Button>
                </Row>
                <Row className={styles['app-path']}>
                  {app.path}
                </Row>
              </Card>
            ))
          ) : (
              <div className={styles['no-app']}>
                <Empty />
              </div>
            )}
        </Row>
      </div>
    );
  }
}

export default Application;
