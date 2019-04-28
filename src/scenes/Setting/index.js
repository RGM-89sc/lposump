import React, { Component } from 'react';
import { Col, Row, Switch, Button, Modal, message } from 'antd';
import styles from './index.module.css';

const { ipcRenderer } = window.require('electron');

const confirm = Modal.confirm;

class Setting extends Component {
  constructor(props) {
    super(props);
    this.setAutoStart = this.setAutoStart.bind(this);
    this.clearAllData = this.clearAllData.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      startWhenSysUp: JSON.parse(window.localStorage.getItem('autoStart'))
    }
  }

  setAutoStart(checked) {
    if (checked) {
      ipcRenderer.send('enableAutoStart');
    } else {
      ipcRenderer.send('disableAutoStart');
    }
    this.setState({
      startWhenSysUp: checked
    });
    window.localStorage.setItem('autoStart', checked + '');
  }

  clearAllData() {
    confirm({
      title: '请确认下一步操作',
      content: '将删除应用列表以及方案列表中的数据且不可恢复，是否继续？',
      onOk() {
        window.localStorage.removeItem('autoStart');
        window.localStorage.removeItem('defaultPlanID');
        window.localStorage.removeItem('plans');
        window.localStorage.removeItem('apps');
        message.success('清除成功');
      },
      onCancel() { },
    });
  }

  reset() {
    const that = this;
    confirm({
      title: '请确认下一步操作',
      content: '将还原所有设置，是否继续？',
      onOk() {
        ipcRenderer.send('enableAutoStart');
        that.setState({
          startWhenSysUp: true
        });
        window.localStorage.setItem('autoStart', true + '');
      },
      onCancel() { },
    });
  }

  render() {
    return (
      <div>
        <Row className={styles['setting-item']}>
          <div className={styles['item-label']}>
            <span>开机自启动</span>
          </div>
          <div className={styles['item-control']}>
            <Switch defaultChecked checked={this.state.startWhenSysUp} onChange={this.setAutoStart} />
          </div>
        </Row>
        <Row className={styles['setting-item']}>
          <div className={styles['item-label']}>
            <span>应用数据</span>
          </div>
          <div className={styles['item-control']}>
            <Button onClick={this.clearAllData}>清除所有数据</Button>
          </div>
        </Row>
        <Row className={styles['setting-item']}>
          <div className={styles['item-label']}></div>
          <div className={styles['item-control']}>
            <Button onClick={this.reset}>重置设置</Button>
          </div>
        </Row>
      </div>
    );
  }
}

export default Setting;
