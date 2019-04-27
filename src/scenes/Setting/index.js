import React, { Component } from 'react';
import { Col, Row, Switch } from 'antd';
import styles from './index.module.css';
const { ipcRenderer } = window.require('electron');

class Setting extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      startWhenSysUp: JSON.parse(window.localStorage.getItem('autoStart'))
    }
  }

  onChange(checked) {
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

  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <span style={{ marginRight: '20px' }}>开机自启动</span>
            <Switch defaultChecked checked={this.state.startWhenSysUp} onChange={this.onChange} />
          </Col>
        </Row>
        <Row>

        </Row>
      </div>
    );
  }
}

export default Setting;
