import React, {
  Text,
  View,
  Animated,
  Component,
  StyleSheet,
  TouchableHighlight
} from 'react-native'
import * as format from '../../scripts/format.js'
import IonIcon from 'react-native-vector-icons/Ionicons'
import EntypoIcon from 'react-native-vector-icons/Entypo'

const ACTION_TIMER = 600

class DashboardSongInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      liked: false,
      reblogged: false,
      pressAction: new Animated.Value(0)
    }

    this.likeSong = this.likeSong.bind(this)
    this.reblogSong = this.reblogSong.bind(this)
    this.handleIconPressIn = this.handleIconPressIn.bind(this)
    this.handleIconPressOut = this.handleIconPressOut.bind(this)
    this.animationActionComplete = this.animationActionComplete.bind(this)
  }

  componentWillMount () {
    this._value = 0
    this.state.pressAction.addListener((evt) => { this._value = evt.value })
  }

  animationActionComplete () {
    if (this._value === 1) {
      console.log('WHOA')
    }
  }

  handleIconPressIn () {
    Animated.timing(this.state.pressAction, {
      duration: ACTION_TIMER,
      toValue: 1
    }).start(this.animationActionComplete)
  }

  handleIconPressOut () {
    Animated.timing(this.state.pressAction, {
      duration: this._value * ACTION_TIMER,
      toValue: 0
    }).start()
  }

  likeSong () {
    this.setState({ liked: !this.state.liked })
  }

  reblogSong () {
    this.setState({ reblogged: !this.state.reblogged })
  }

  render () {
    const PlayCountIconProps = {
      name: 'play',
      color: '#616566',
      size: 12
    }

    const ReblogTouchProps = {
      activeOpacity: 0.5,
      underlayColor: 'transparent',
      onPress: this.reblogSong,
      onPressIn: this.handleIconPressIn,
      onPressOut: this.handleIconPressOut
    }

    const LikeTouchProps = {
      activeOpacity: 0.5,
      underlayColor: 'transparent',
      onPress: this.likeSong
    }

    const LikeIconProps = {
      name: this.state.liked ? 'ios-heart' : 'ios-heart',
      color: this.state.liked ? '#e17d74' : '#aaa',
      size: 18,
      style: {
        marginLeft: 10,
        marginRight: 5
      }
    }

    const ReblogIconProps = {
      name: 'retweet',
      color: this.state.reblogged ? '#4c95ad' : '#aaa',
      size: 18,
      style: {
        marginLeft: 5,
        marginRight: 10
      }
    }

    return (
      <View style={styles.songInfoContainer}>
        <View style={styles.songInfoContent}>
          <Text style={styles.songTitleText}> {this.props.trackName} </Text>
          <Text style={styles.artistText}> {this.props.artist} </Text>
        </View>
        <View style={styles.songStatsContent}>
          <View style={styles.playCountContent}>
            <IonIcon {...PlayCountIconProps}>
              <Text style={styles.plays}> {format.insertCommas(this.props.plays)} plays </Text>
            </IonIcon>
          </View>
          <View style={styles.likeReblogContainer}>
            <TouchableHighlight {...LikeTouchProps}>
              <IonIcon {...LikeIconProps}/>
            </TouchableHighlight>
            <Text style={{color: '#999', fontSize: 14}}> {'|'} </Text>
            <TouchableHighlight {...ReblogTouchProps}>
              <Animated.View>
                <EntypoIcon {...ReblogIconProps}/>
              </Animated.View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

DashboardSongInfo.propTypes = {
  trackName: React.PropTypes.string,
  artist: React.PropTypes.string,
  plays: React.PropTypes.number
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: 5
  },
  songInfoContent: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingTop: 5,
    backgroundColor: 'transparent'
  },
  albumContent: {
    flex: 1,
    flexDirection: 'column'
  },
  songTitleText: {
    fontWeight: '500',
    fontSize: 15
  },
  artistText: {
    fontWeight: '400',
    fontSize: 12
  },
  songStatsContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  playCountContent: {
    padding: 5,
    paddingRight: 0
  },
  likeReblogContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#aaa'
  }
})

export default DashboardSongInfo