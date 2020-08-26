import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

class FBLoginButton extends React.Component {
  responseFacebook(response) {
    console.log(response);
  }

  render() {
    return (
      <FacebookLogin
        appId="185745958145518"
        autoLoad={true}
        fields="name,email,picture"
        scope="public_profile,user_friends"
        callback={this.responseFacebook}
        render={renderProps => (
          <span onClick={renderProps.onClick}>Connect FB</span>
        )}
      />
    )
  }
}

export default FBLoginButton;
