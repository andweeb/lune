/**
 *  Dashboard Track Component
 */

'use strict'

import {
  View,
  Image,
  StyleSheet,
  NativeModules,
  TouchableOpacity
} from 'react-native'
import React, { Component } from 'react'

import Dimensions from 'Dimensions'
import queryString from 'query-string'
const screen = Dimensions.get('window')

import Header from './Header'
import Footer from './Footer'
import TrackInfo from './Info'

class Track extends Component {

  parseAudioURI (playerHTML) {
    let src = playerHTML.match(/src="([^"]*)"/)[1]
    let audioKey = decodeURIComponent(src)
    console.log(`Parsing song ${audioKey}`)

    const query = queryString.parse(audioKey.substring(audioKey.indexOf('?')))
    console.log(`Audio file: ${query.audio_file}`)

    // Modify the audio file uri appropriately
    if (query.audio_file.includes('tumblr.com')) {
      let uri = 'http://a.tumblr.com/'
      audioKey = audioKey.substring(audioKey.lastIndexOf('/') + 1, audioKey.lastIndexOf('&'))
      uri += (audioKey.search('o1.mp3') > 0) ? audioKey : audioKey + 'o1.mp3'
      uri = encodeURI(uri)
      console.log(`Playing song @ ${uri}`)
      return uri
    } else {
      let uri = query.audio_file
      uri = encodeURI(uri)
      console.log(`Playing song @ ${uri}`)
      return uri
    }
  }

  render () {
    return (
      <View style={styles.container}>

        {/* Reblog information & menu icon */}
        <Header
          auth={this.props.auth}
          blog={this.props.blog}
          blogName={this.props.blog_name}
          navigator={this.props.navigator}
          sourceTitle={this.props.source_title}
          reblogDate={this.props.date.substr(0, this.props.date.lastIndexOf(' '))}
          avatarUri={`https://api.tumblr.com/v2/blog/${this.props.blog_name}.tumblr.com/avatar/64`}
        />

        {/* Album art cover */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => NativeModules.AudioPlayer.play(this.parseAudioURI(this.props.player))}>
          <Image
            style={[styles.albumArt, {width: this.props.album_art ? -1 : screen.width}]}
            source={this.props.album_art ? {uri: this.props.album_art} : require('../../assets/coverart.png')}
          />
        </TouchableOpacity>

        {/* Track information */}
        <TrackInfo
          trackName={this.props.track_name}
          artist={this.props.artist}
          plays={this.props.plays}
        />

        {/* Footer containing notes count and tags */}
        <Footer
          id={this.props.id}
          tags={this.props.tags}
          noteCount={this.props.note_count}
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 2,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#ccc',
    backgroundColor: 'white'
  },
  albumArt: {
    height: 100
  }
})

// `Track`s prop types take the shape of Tumblr API's post objects
Track.propTypes = {
  track_name: React.PropTypes.string,
  artist: React.PropTypes.string,

  id: React.PropTypes.number.isRequired,
  tags: React.PropTypes.array.isRequired,
  blog: React.PropTypes.object.isRequired,
  date: React.PropTypes.string.isRequired,
  plays: React.PropTypes.number.isRequired,
  player: React.PropTypes.string.isRequired,
  blog_name: React.PropTypes.string.isRequired,
  note_count: React.PropTypes.number.isRequired,
  source_title: React.PropTypes.string,

  navigator: React.PropTypes.object.isRequired,
  auth: React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    sec: React.PropTypes.string.isRequired,
    token: React.PropTypes.string.isRequired,
    tokenSecret: React.PropTypes.string.isRequired
  })
}

export default Track
