import React from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import BallotIcon from '@material-ui/icons/Ballot';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import PeopleIcon from '@material-ui/icons/People';
import styled from 'styled-components';
import { cordovaFooterHeight } from '../../utils/cordovaOffsets';
import { historyPush } from '../../utils/cordovaUtils';
import { stringContains } from '../../utils/textFormat';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';

const webAppConfig = require('../../config');


class FooterBar extends React.Component {
  static propTypes = {
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMe: 0, // eslint-disable-line react/no-unused-state
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));

    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(), // eslint-disable-line react/no-unused-state
    });
  }

  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate (nextProps, nextState) {
    if (!signInModalGlobalState.getBool('isShowingSignInModal')) {
      renderLog('DO NOT RENDER FooterBar');
      return false;
    }
    return true;
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(), // eslint-disable-line react/no-unused-state
    });
  }

  handleChange = (event, value) => {
    switch (value) {
      case 0:
        return historyPush('/ballot');
      case 1:
        return historyPush('/values');
      case 2:
        return historyPush('/friends');
      case 3:
        return historyPush('/ballot/vote');
      default:
        return null;
    }
  };

  getSelectedTab = () => {
    const { pathname } = this.props;
    if (stringContains('/ballot/vote', pathname.toLowerCase())) return 2;
    if (stringContains('/ballot', pathname.toLowerCase())) return 0;
    if (stringContains('/friends', pathname.toLowerCase())) return 2;
    if (stringContains('/value', pathname.toLowerCase())) return 1; // '/values'
    return -1;
  };

  handleNavigation = to => historyPush(to);

  render () {
    renderLog('FooterBar');  // Set LOG_RENDER_EVENTS to log all renders
    const numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length || 0;

    const badgeStyle = {
      display: 'inline-block',
    };

    const enableFriends = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;   // DALE: FRIENDS TEMPORARILY DISABLED

    return (
      <FooterBarWrapper>
        <div className="footer-container u-show-mobile-tablet" style={{ height: `${cordovaFooterHeight()}` }}>
          <BottomNavigation value={this.getSelectedTab()} onChange={this.handleChange} showLabels>
            <BottomNavigationAction className="no-outline" id="ballotTabFooterBar" label="Ballot" showLabel icon={<BallotIcon />} />
            <BottomNavigationAction className="no-outline" id="valuesTabFooterBar" label="Values" showLabel icon={<QuestionAnswerIcon />} />
            { enableFriends ?
              (
                <BottomNavigationAction
                  className="no-outline"
                  id="friendsTabFooterBar"
                  label="Friends"
                  showLabel
                  icon={(
                    <Badge badgeContent={numberOfIncomingFriendRequests} color="primary" max={9} style={badgeStyle} onClick={() => this.handleNavigation('/friends')}>
                      <PeopleIcon />
                    </Badge>
                  )}
                />
              ) : '' }
            <BottomNavigationAction className="no-outline" id="voteTabFooterBar" label="Vote" showLabel icon={<HowToVoteIcon />} />
          </BottomNavigation>
        </div>
      </FooterBarWrapper>
    );
  }
}
const FooterBarWrapper = styled.div`
  @media print{
    display: none;
  }
`;
export default FooterBar;
