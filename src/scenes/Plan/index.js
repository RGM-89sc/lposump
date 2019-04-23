import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  Empty,
  Modal,
  Select,
  Form,
  Input,
  TimePicker,
  List,
  message
} from 'antd';
import uuid from 'uuid/v4';
import styles from './index.module.css';

class Plan extends Component {
  constructor(props) {
    super(props);
    this.changeNewPlanName = this.changeNewPlanName.bind(this);
    this.changeNewPlanAPPList = this.changeNewPlanAPPList.bind(this);
    this.changeNewPlanTime = this.changeNewPlanTime.bind(this);
    this.setDefaultPlan = this.setDefaultPlan.bind(this);
    this.addPlan = this.addPlan.bind(this);
    this.delPlan = this.delPlan.bind(this);
    this.state = {
      defaultPlanID: window.localStorage.getItem('defaultPlanID'),
      plans: JSON.parse(window.localStorage.getItem('plans')) || [],
      apps: JSON.parse(window.localStorage.getItem('apps')) || [],
      addingPlan: false,
      newPlanName: '',
      newPlanAppList: [],
      newPlanTime: null,
      newPlanTimeString: ''
    };
  }

  setDefaultPlan(planID) {
    window.localStorage.setItem('defaultPlanID', planID);
    this.setState({
      defaultPlanID: planID
    });
  }

  changeNewPlanName(e) {
    this.setState({
      newPlanName: e.target.value
    });
  }

  changeNewPlanAPPList(value) {
    this.setState({
      newPlanAppList: value
    });
  }

  changeNewPlanTime(time, timeString) {
    this.setState({
      newPlanTime: time,
      newPlanTimeString: timeString
    });
  }

  addPlan() {
    if (this.state.newPlanName && this.state.newPlanAppList.length > 0 && this.state.newPlanTimeString) {
      const newPlanID = uuid().split('-').join('');
      this.setState({
        plans: [
          ...this.state.plans,
          {
            id: newPlanID,
            name: this.state.newPlanName,
            appList: this.state.newPlanAppList,
            time: this.state.newPlanTimeString
          }
        ]
      });
      setTimeout(() => {
        window.localStorage.setItem('plans', JSON.stringify(this.state.plans));
        this.setState({
          newPlanName: '',
          newPlanAppList: [],
          newPlanTime: null,
          newPlanTimeString: '',
          addingPlan: false
        });
        message.success('方案已添加，设置默认方案后将自动根据设定时间执行');
      }, 0);
    } else {
      message.error('请先完成相关信息的填写');
    }
  }

  delPlan(plan) {
    const that = this;
    Modal.confirm({
      title: '确认信息',
      content: '是否删除该项？',
      onOk() {
        const plans = that.state.plans.filter(p => {
          return p.id !== plan.id;
        });
        if (plan.id === that.state.defaultPlanID) {
          window.localStorage.removeItem('defaultPlanID');
          that.props.defaultPlanHaveBeenDel();
        }
        that.setState({
          defaultPlanID: '',
          plans
        });
        window.localStorage.setItem('plans', JSON.stringify(plans));
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
          <Col span={12} className={styles.title}>
            <span>默认方案：</span>
            <Select
              defaultValue={this.state.defaultPlanID}
              style={{ width: 120 }}
              onChange={this.setDefaultPlan}>
              {this.state.plans.map(plan => (
                <Select.Option value={plan.id} key={plan.id}>{plan.name}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={12} className={styles.control}>
            <Button type="primary" onClick={() => { this.setState({ addingPlan: true }) }}>添加方案</Button>
            <Modal
              title="添加方案"
              style={{ top: 30 }}
              visible={this.state.addingPlan}
              onOk={this.addPlan}
              onCancel={() => { this.setState({ addingPlan: false }) }}
            >
              <Form layout="vertical">
                <Form.Item label="方案名称：">
                  <Input placeholder="方案名称" value={this.state.newPlanName} onChange={this.changeNewPlanName} />
                </Form.Item>
                <Form.Item label="启动列表：">
                  <Select mode="multiple" value={this.state.newPlanAppList} onChange={this.changeNewPlanAPPList}>
                    {this.state.apps.map(app => (
                      <Select.Option value={JSON.stringify(app)} key={app.path}>{app.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="执行时间：">
                  <TimePicker format="HH:mm" value={this.state.newPlanTime} onChange={this.changeNewPlanTime} />
                </Form.Item>
              </Form>
            </Modal>
          </Col>
        </Row>
        <Row className={styles['plan-list']}>
          {this.state.plans.length > 0 ? (
            this.state.plans.map(plan => (
              <Card className={styles.plan} key={plan.id}>
                <Row className={styles['plan-name']}>
                  <span style={{ float: 'left' }}>{plan.name}</span>
                  <Button type="danger" ghost onClick={this.delPlan.bind(this, plan)}>删除</Button>
                </Row>
                <Row className={styles['plan-applist']}>
                  <List
                    bordered
                    dataSource={plan.appList}
                    renderItem={item => (<List.Item>{JSON.parse(item).name}</List.Item>)}
                  />
                </Row>
                <Row className={styles['plan-time']}>
                  执行时间：{plan.time}
                </Row>
              </Card>
            ))
          ) : (
              <div className={styles['no-plan']}>
                <Empty />
              </div>
            )}
        </Row>
      </div>
    );
  }
}

export default Plan;
