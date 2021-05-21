import { Twitter } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';
import LoadingWheel from '../LoadingWheel';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));

class OrganizationPopoverCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isVoterOwner: false,
      organization: {},
    };
  }

  componentDidMount () {
    // console.log('OrganizationPopoverCard componentDidMount, this.props: ', this.props);
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    let organization = {};
    const { organizationWeVoteId } = this.props;
    if (organizationWeVoteId) {
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== '' && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
    }
    this.setState({
      organization,
      // organizationWeVoteId,
    });
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if onOrganizationStoreChange didn't see any changes
  //   let organizationWeVoteId = '';
  //   if (this.state.organization) {
  //     ({ organization_we_vote_id: organizationWeVoteId } = this.state.organization);
  //   }
  //   let nextOrganizationWeVoteId = '';
  //   if (nextState.organization) {
  //     ({ organization_we_vote_id: nextOrganizationWeVoteId } = nextState.organization);
  //   }
  //   if (organizationWeVoteId !== nextOrganizationWeVoteId) {
  //     return true;
  //   }
  //   if (this.state.isVoterOwner !== nextState.isVoterOwner) {
  //     return true;
  //   }
  //   return false;
  // }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.props;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    if (voter && voter.linked_organization_we_vote_id) {
      const { organizationWeVoteId } = this.props;
      const { linked_organization_we_vote_id: linkedOrganizationWeVoteId } = voter;
      const isVoterOwner = linkedOrganizationWeVoteId === organizationWeVoteId;
      this.setState({
        isVoterOwner,
      });
    }
  }

  onEdit = () => {
    const { organizationWeVoteId } = this.props;
    historyPush(`/voterguideedit/${organizationWeVoteId}`);
  }

  render () {
    renderLog('OrganizationPopoverCard');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('OrganizationPopoverCard, organization: ', this.state.organization);
    if (!this.state.organization) {
      return <div>{LoadingWheel}</div>;
    }
    const { organizationWeVoteId } = this.props;
    const { isVoterOwner } = this.state;
    const {
      organization_twitter_handle: organizationTwitterHandle, twitter_description: twitterDescriptionRaw,
      twitter_followers_count: twitterFollowersCount,
      organization_photo_url_large: organizationPhotoUrlLarge, organization_website: organizationWebsiteRaw,
      organization_name: organizationName, organization_banner_url: organizationBannerUrl,
    } = this.state.organization;
    const organizationWebsite = organizationWebsiteRaw && organizationWebsiteRaw.slice(0, 4) !== 'http' ? `http://${organizationWebsiteRaw}` : organizationWebsiteRaw;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = organizationName || '';
    const twitterDescription = twitterDescriptionRaw || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    return (
      <Wrapper>
        {organizationBannerUrl ? (
          <BannerImage>
            <img src={organizationBannerUrl} />
          </BannerImage>
        ) : (
          <>
            <br />
            <br />
          </>
        )}

        <Container>
          <LogoFollowToggleContainer>
            { organizationPhotoUrlLarge && (
              <Link
                id="organizationPopoverCardImage"
                to={voterGuideLink}
                className="u-no-underline"
              >
                <ImageContainer>
                  <img src={organizationPhotoUrlLarge} width="60" height="60" alt={`${displayName}`} />
                </ImageContainer>
              </Link>
            )}
            { isVoterOwner ? (
              <Button variant="warning" size="small" bsPrefix="pull-right" onClick={this.onEdit}>
                <span>Edit Your Endorsements</span>
              </Button>
            ) : (
              <div>
                <FollowToggleContainer>
                  <FollowToggle organizationWeVoteId={organizationWeVoteId} />
                </FollowToggleContainer>
              </div>
            )}
          </LogoFollowToggleContainer>
          <MainContent>
            <Link
              id="organizationPopoverCardName"
              to={voterGuideLink}
            >
              <OrganizationName>{displayName}</OrganizationName>
            </Link>
            { organizationTwitterHandle && (
              <OrganizationTwitterHandle>
                @
                {organizationTwitterHandle}
                &nbsp;&nbsp;
                {!!(twitterFollowersCount) && (
                  <span>
                    {/* <span className="fab fa-twitter twitter-followers__icon" /> */}
                    <Twitter />
                    {numberWithCommas(twitterFollowersCount)}
                  </span>
                )}
              </OrganizationTwitterHandle>
            )}
            {twitterDescriptionMinusName && (
              <Description>
                <ParsedTwitterDescription
                  twitter_description={twitterDescriptionMinusName}
                />
              </Description>
            )}
            {organizationWebsite && (
              <span className="u-wrap-links">
                <OpenExternalWebSite
                  linkIdAttribute="organizationWebsite"
                  url={organizationWebsite}
                  target="_blank"
                  body={(
                    <span>
                      {organizationWebsite}
                      {' '}
                      <i className="fas fa-external-link-alt" />
                    </span>
                  )}
                />
              </span>
            )}
            {/* 5 of your friends follow Organization Name<br /> */}
          </MainContent>
        </Container>
      </Wrapper>
    );
  }
}
OrganizationPopoverCard.propTypes = {
  organizationWeVoteId: PropTypes.string.isRequired,
};

const Wrapper = styled.div`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  right: 12px;
  bottom: 8px;
  border-radius: 3px;
  margin-left: 12px;
  margin-top: 8px;
`;

const Container = styled.div`
  padding: 8px;
`;

const BannerImage = styled.div`
  background: #f7f7f7;
  min-height: 90.05px !important;
  display: block;
  width: 100%;
`;

const LogoFollowToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  bottom: 32px;
`;

const ImageContainer = styled.div`
  * {
    border-radius: 50px;
  }
`;

const FollowToggleContainer = styled.div`
  width: 125px;
`;

const MainContent = styled.div`
  margin-top: -24px;
`;

const OrganizationName = styled.h3`
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.brandBlue};
  margin-bottom: 4px;
  text-decoration: none !important;
`;

const OrganizationTwitterHandle = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin: 0;
  padding: 0;
  color: #ccc;
`;

const Description = styled.div`
  margin-top: 8px;
  color: #333 !important;
  font-weight: 500 !important;
  font-size: 12px !important;
`;

export default OrganizationPopoverCard;
