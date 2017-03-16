import React, { Component } from "react";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import AddFriendsByEmail from "../components/Friends/AddFriendsByEmail";
import GuideActions from "../actions/GuideActions";
import GuideStore from "../stores/GuideStore";
import FollowingFilter from "../components/Navigation/FollowingFilter";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";
import OrganizationsFollowedOnTwitter from "../components/Connect/OrganizationsFollowedOnTwitter";

/* VISUAL DESIGN HERE: https://invis.io/E45246B2C */

export default class Connect extends Component {
	static propTypes = {

	};

	constructor (props) {
		super(props);
    this.state = {
      add_friends_type: "ADD_FRIENDS_BY_EMAIL",
      current_friend_list: FriendStore.currentFriends(),
      organizations_followed_on_twitter_list: GuideStore.followedOnTwitterList()
    };
	}

  componentDidMount () {
    if (this.state.current_friend_list) {
      FriendActions.currentFriends();
    }
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    if (this.state.organizations_followed_on_twitter_list) {
      GuideActions.organizationsFollowedRetrieve();
    }
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
  }

  _onFriendStoreChange () {
    this.setState({
      current_friend_list: FriendStore.currentFriends()
    });
  }

  _onGuideStoreChange (){
    var organizations_followed_on_twitter_list = GuideStore.followedOnTwitterList();
    if (organizations_followed_on_twitter_list !== undefined && organizations_followed_on_twitter_list.length > 0){
      this.setState({ organizations_followed_on_twitter_list: GuideStore.followedOnTwitterList() });
    }
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
    this.guideStoreListener.remove();
  }

	static getProps () {
		return {};
	}

  changeAddFriendsType (event) {
    this.setState({add_friends_type: event.target.id});
  }

  getCurrentRoute (){
    var current_route = "/more/connect";
    return current_route;
  }

  toggleEditMode (){
    this.setState({editMode: !this.state.editMode});
  }

	onKeyDownEditMode (event) {
		let enterAndSpaceKeyCodes = [13, 32];
		let scope = this;
		if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
			scope.setState({editMode: !this.state.editMode});
		}
	}

  getFollowingType (){
    switch (this.getCurrentRoute()) {
      case "/more/connect":
      default :
        return "YOUR_FRIENDS";
    }
  }

	render () {
		return <div>
			<Helmet title="Build Your We Vote Network" />
      <h1 className="h1">Build Your We Vote Network</h1>
      <FollowingFilter following_type={this.getFollowingType()} />

      { this.state.organizations_followed_on_twitter_list && this.state.organizations_followed_on_twitter_list.length ?
        <div className="container-fluid well u-stack--md u-inset--md">
          <h4 className="text-left">See Organizations you follow on Twitter</h4>
          <div className="card-child__list-group">
            {
              <OrganizationsFollowedOnTwitter
                    organizationsFollowedOnTwitter={this.state.organizations_followed_on_twitter_list} />
            }
            <Link className="pull-right" to="/opinions_followed">See all organizations you follow </Link>
          </div>
        </div> : null }

			<div className="container-fluid well u-stack--md u-inset--md">
        <h4 className="text-left">Add Friends by Email</h4>
        <AddFriendsByEmail />
      </div>

      <Link to="/requests">
        <Button bsStyle="link">
          See Friend Requests
        </Button>
      </Link>
		</div>;
	}
}
