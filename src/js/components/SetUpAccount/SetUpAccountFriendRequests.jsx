import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import SuggestedFriendList from '../Friends/SuggestedFriendList';
import FriendStore from '../../stores/FriendStore';
import { SectionTitle } from '../Style/friendStyles';
import {
  SetUpAccountIntroText,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';


class SetUpAccountFriendRequests extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    this.setState({
      suggestedFriendList,
    });

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountFriendRequests componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.props.goToNextStep();
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    this.setState({
      suggestedFriendList,
    });
  }

  render () {
    renderLog('SetUpAccountFriendRequests');  // Set LOG_RENDER_EVENTS to log all renders
    const { suggestedFriendList } = this.state;

    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          <SetUpAccountTitle>Friends</SetUpAccountTitle>
          <SetUpAccountIntroText>&nbsp;</SetUpAccountIntroText>
        </SetUpAccountTop>
        {/* Chip filters here */}
        <SetUpAccountSubTitleWrapper>
          <SectionTitle>
            People you may know
          </SectionTitle>
        </SetUpAccountSubTitleWrapper>
        <SuggestedFriendList
          friendList={suggestedFriendList}
          editMode
        />
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountFriendRequests.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const styles = () => ({
});

const SetUpAccountSubTitleWrapper = styled('div')`
  max-width: 538px;
  width: 100%;
`;

export default withStyles(styles)(SetUpAccountFriendRequests);
