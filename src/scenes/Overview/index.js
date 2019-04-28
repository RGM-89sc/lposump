import React, { Component } from 'react';
import { Button, Col, Row, Select } from 'antd';
import styles from './index.module.css';
const child_process = window.require('child_process');

class Overview extends Component {
  constructor(props) {
    super(props);
    this.setCurrentPlan = this.setCurrentPlan.bind(this);
    this.getCurrentPlan = this.getCurrentPlan.bind(this);
    this.startCurrentPlan = this.startCurrentPlan.bind(this);

    const defaultPlanID = window.localStorage.getItem('defaultPlanID') || '';
    const plans = JSON.parse(window.localStorage.getItem('plans')) || [];
    const currentPlan = this.getCurrentPlan(defaultPlanID, plans);
    this.state = {
      defaultPlanID,
      plans,
      currentPlan
    };
  }

  getCurrentPlan(defaultPlanID, plans) {
    let currentPlan = {};
    if (defaultPlanID && plans.length > 0) {
      plans.some(plan => {
        if (plan.id === defaultPlanID) {
          currentPlan = plan;
          return true;
        }
        return false;
      });
    }
    return currentPlan;
  }

  setCurrentPlan(planID) {
    this.setState({
      currentPlan: this.getCurrentPlan(planID, this.state.plans)
    });
  }

  startCurrentPlan() {
    this.state.currentPlan.appList.forEach(app => {
      child_process.execFile(JSON.parse(app).path, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
        }
      });
    });
  }

  render() {
    return (
      <div>
        <Row className={styles.header}>
          <Col span={6}>
            <span>方案：{this.state.currentPlan.name}</span>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={12} className={styles.main}>
            <Row className={styles['select-plan']}>
              <span>切换方案：</span>
              <Select
                size="large"
                defaultValue={this.state.currentPlan.id}
                style={{ width: 120 }}
                onChange={this.setCurrentPlan}>
                {this.state.plans.map(plan => (
                  <Select.Option value={plan.id} key={plan.id}>{plan.name}</Select.Option>
                ))}
              </Select>
            </Row>
            <Row className={styles['plan-time']}>
              <span>执行时间：{this.state.currentPlan.time ? this.state.currentPlan.time : '--:--'}</span>
            </Row>
            <Row className={styles['start-plan']}>
              <Button type="primary" size="large" onClick={this.startCurrentPlan}>马上执行</Button>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Overview;
