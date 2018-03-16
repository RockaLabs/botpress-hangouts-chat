import React from 'react';

import {
  Form,
  FormGroup,
  FormControl,
  Col,
  Button,
  ControlLabel
} from 'react-bootstrap';

import _ from 'lodash';
import axios from 'axios';

import style from './style.scss';

export default class HangoutsChatModule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      clientEmail: '',
      privateKey: '',
      verificationToken: '',
      hashState: null
    };
  }

  componentDidMount() {
    this.fetchConfig().then(() => {
      this.authenticate();
    });
  }

  getAxios = () => this.props.bp.axios;
  mApi = (method, url, body) =>
    this.getAxios()[method]('/api/botpress-hangouts-chat' + url, body);
  mApiGet = (url, body) => this.mApi('get', url, body);
  mApiPost = (url, body) => this.mApi('post', url, body);

  fetchConfig = () => {
    return this.mApiGet('/config')
      .then(({ data }) => {
        this.setState({
          clientEmail: data.clientEmail,
          privateKey: data.privateKey,
          verificationToken: data.verificationToken,
          loading: false
        });

        setImmediate(() => {
          this.setState({
            hashState: this.getHashState()
          });
        });
      })
      .catch(console.log);
  };

  getHashState = () => {
    const values = _.omit(this.state, ['loading', 'hashState']);
    return _.join(_.toArray(values), '_');
  };

  getRedictURI = () => {
    return this.state.hostname + '/modules/botpress-hangouts-chat';
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  handleSaveConfig = () => {
    this.mApiPost('/config', {
      clientEmail: this.state.clientID,
      privateKey: this.state.privateKey,
      verificationToken: this.state.verificationToken,
      scope: this.state.scope
    })
      .then(({ data }) => {
        this.fetchConfig();
      })
      .catch(err => {
        console.log(err);
      });
  };
  // ----- render functions -----

  renderHeader = title => (
    <div className={style.header}>
      <h4>{title}</h4>
      {this.renderSaveButton()}
    </div>
  );

  renderLabel = label => {
    return (
      <Col componentClass={ControlLabel} sm={3}>
        {label}
      </Col>
    );
  };

  renderInput = (label, name, props = {}) => (
    <FormGroup>
      {this.renderLabel(label)}
      <Col sm={7}>
        <FormControl
          name={name}
          {...props}
          value={this.state[name]}
          onChange={this.handleChange}
        />
      </Col>
    </FormGroup>
  );

  renderTextInput = (label, name, props = {}) =>
    this.renderInput(label, name, {
      type: 'text',
      ...props
    });

  renderSaveButton = () => {
    let opacity = 0;
    if (this.state.hashState && this.state.hashState !== this.getHashState()) {
      opacity = 1;
    }

    return (
      <Button
        className={style.formButton}
        style={{ opacity: opacity }}
        onClick={this.handleSaveConfig}
      >
        Save
      </Button>
    );
  };

  renderConfigSection = () => {
    console.log('style:', style.section);
    return (
      <div className={style.section}>
        {this.renderHeader('Configuration')}

        {this.renderTextInput('Hostname', 'hostname', {
          placeholder: 'e.g. https://a9f849c4.ngrok.io'
        })}

        {this.renderTextInput('Client email', 'clientEmail', {
          placeholder: 'Paste your client email here...'
        })}

        {this.renderTextInput('Private Key', 'privateKey', {
          placeholder: 'Paste your private key here...'
        })}

        {this.renderTextInput('Verification Token', 'verificationToken', {
          placeholder: 'Paste your verification token here...'
        })}
      </div>
    );
  };

  render() {
    //if (this.state.loading) {
    //    return null
    //}

    return (
      <Col md={10} mdOffset={1}>
        <Form horizontal>{this.renderConfigSection()}</Form>
      </Col>
    );
  }
}
