import React, { Component } from 'react';
import { ScrollView, TouchableHighlight, Text, StyleSheet } from 'react-native';
import My2c2pSDK from 'react-native-my2c2p-sdk';
import t, { form } from 'tcomb-form-native';
import faker from 'faker';
import config from './config.json';

export default class AlternativePaymentScreen extends Component {
  static navigationOptions = {
    title: 'Alternative Payment'
  };

  componentDidMount() {
    My2c2pSDK.init(config.privateKey, false);
  }

  initialFormValues() {
    return {
      merchantID: config.merchantID,
      uniqueTransactionCode: faker.random.number({ min: 100000000, max: 999999999 }).toString(),
      desc: faker.commerce.productName(),
      amount: 19.0,
      currencyCode: '702',
      paymentChannel: 'ONE_TWO_THREE',
      cardHolderName: faker.name.findName(),
      cardHolderEmail: faker.internet.email(),
      agentCode: 'SCB',
      channelCode: 'ATM',
      secretKey: config.secretKey
    };
  }

  handlePayment = async () => {
    const { navigate } = this.props.navigation;
    try {
      const params = { ...this.form.getValue(), paymentUI: false };
      const response = await My2c2pSDK.requestAlternativePayment(params);
      console.log(response);
      navigate('PaymentResult', { result: response });
    } catch(error) {
      console.log(error);
      navigate('PaymentResult', { result: error.message });
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <form.Form
          ref={form => (this.form = form)}
          type={payment}
          value={this.initialFormValues()}
        />
        <TouchableHighlight onPress={this.handlePayment} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

const payment = t.struct({
  merchantID: t.String,
  secretKey: t.String,
  uniqueTransactionCode: t.String,
  desc: t.String,
  amount: t.Number,
  cardHolderName: t.String,
  cardHolderEmail: t.String,
  currencyCode: t.String,
  paymentChannel: t.String,
  agentCode: t.String,
  channelCode: t.String,
  payCategoryID: t.maybe(t.String),
  userDefined1: t.maybe(t.String),
  userDefined2: t.maybe(t.String),
  userDefined3: t.maybe(t.String),
  userDefined4: t.maybe(t.String),
  userDefined5: t.maybe(t.String)
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  submitButton: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#1e88e5'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18
  }
});