import { Place } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));


class FindPollingLocation extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { classes } = this.props;
    const getPollingLocationUrl = 'https://gttp.votinginfoproject.org/';
    return (
      <Wrapper>
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="getPollingLocation"
            url={getPollingLocationUrl}
            target="_blank"
            className="u-gray-mid"
            body={(
              <Button
                classes={{ root: classes.ballotButtonRoot }}
                color="primary"
                variant="contained"
              >
                <Place classes={{ root: classes.ballotButtonIconRoot }} />
                Your Polling Location
              </Button>
            )}
          />
        </Suspense>
        <InformationTextWrapper className="u-show-desktop">
          <InfoCircleIcon />
          Find the location where you can hand deliver your official ballot before the end of election day.
        </InformationTextWrapper>
      </Wrapper>
    );
  }
}
FindPollingLocation.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  iconRoot: {
    color: '#fff',
    fontSize: 36,
    margin: 'auto 10px',
  },
});

const Wrapper = styled('div')`
  margin-bottom: 15px;
  @media print{
    display: none;
  }
`;

const InformationTextWrapper = styled('div')`
  margin: 10px 0;
  word-wrap: break-word;
  float: left;
  text-align: left;
  color: #555;
  font-size: 14px;
`;

export default withStyles(styles)(FindPollingLocation);
