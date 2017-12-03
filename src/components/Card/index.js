// @flow
import React, { Component } from 'react'
import 'whatwg-fetch'
import getValue from 'get-value'

import CardWrap from './CardWrap'
import CardImage from './CardImage'
import CardContent from './CardContent'

const API_ENDPOINT = 'https://api.microlink.io'

const getUrlPath = data => getValue(data, 'url') || data

type CardSizes = 'large'

type CardProps = {
  contrast?: boolean,
  endpoint?: string,
  url: string,
  size?: CardSizes
}

type State = {
  loaded: boolean,
  title?: string,
  description?: string,
  image?: string,
  url?: string
}

export default class extends Component<CardProps, State> {
  static defaultProps = {
    rel: 'noopener noreferrer',
    rounded: false,
    target: '_blank'
  }

  state: State = { loaded: false }

  componentWillMount () {
    const {
      url: targetUrl,
      contrast,
      endpoint: api = API_ENDPOINT
    } = this.props

    let url = `${api}/?url=${targetUrl}`
    if (contrast) url = `${url}&palette`

    fetch(url)
      .then(res => res.json())
      .then(res => {
        const { title, description, url, image } = res.data
        this.setState({ title, description, url, image, loaded: true })
      })
  }

  render () {
    const { title, description, image, url, loaded } = this.state
    const { size } = this.props
    const imagePath = getUrlPath(image)
    const largeClass = size === 'large' ? '-MicrolinkCard-large' : ''

    return (
      loaded && (
        <CardWrap href={url} title={title} {...this.props} {...this.state} className={largeClass}>
          {image && <CardImage image={imagePath} />}
          <CardContent
            title={title}
            description={description}
            url={url}
          />
        </CardWrap>
      )
    )
  }
}
