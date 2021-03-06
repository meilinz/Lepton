'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Modal, Image } from 'react-bootstrap'
import { Radar } from 'react-chartjs'
import { updateDashboardModalStatus } from '../../actions'
import robotocatImage from '../../utilities/octodex/robotocat.png'

import './index.scss'

class Dashboard extends Component {
  renderDashboardSection () {
    const { gistTags } = this.props

    const langTags = Object.keys(gistTags)
      .filter(key => key.startsWith('lang@') && key !== 'lang@All')
      .sort((t1, t2) => gistTags[t2].length - gistTags[t1].length)

    const maxNum = 5
    const rawLabels = langTags.slice(0, langTags.length > maxNum ? maxNum : langTags.length)
    const data = rawLabels.map(lang => gistTags[lang].length)
    const labels = rawLabels.map(rawLabel => rawLabel.substr('@lang'.length))

    if (data.length > 2) return this.buildRadarChart(data, labels)

    return (
      <div className='dashboard-section'>
        <Image className='octocat' src={ robotocatImage } rounded/>
        <div className='greeting'>
          Not enough data. Try creating gists of more than two languages. Happy Coding!
        </div>
      </div>
    )
  }

  buildRadarChart (data, labels) {
    const GREY = '#C2C4D1'
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'My Language Stats',
          fillColor: 'rgba(81,192,191,0.2)',
          strokeColor: 'rgba(81,192,191,1)',
          pointColor: 'rgba(81,192,191,1)',
          pointStrokeColor: GREY,
          pointHighlightFill: GREY,
          pointHighlightStroke: 'rgba(81,192,191,1)',
          data: data
        }
      ]
    }
    const chartOptions = {}

    return (
      <div className='dashboard-section'>
        <Radar data={ chartData } options={ chartOptions } width="350" height="300"/>
        <div className='greeting'>
          { labels[0] === 'Other'
            ? 'Hmm... Looks like you are learning a mysterious language(Other)...'
            : `Well done! You are on the road to ${labels[0]} Master!`
          }
        </div>
      </div>
    )
  }

  renderSettingModalBody () {
    return (
      <div>
        { this.renderDashboardSection() }
      </div>
    )
  }

  handleCloseButtonClicked () {
    const { updateDashboardModalStatus } = this.props
    updateDashboardModalStatus('OFF')
  }

  render () {
    return (
      <Modal
        className='dashboard-modal'
        bsSize='small'
        show={ this.props.dashboardModalStatus === 'ON' }
        onHide={ this.handleCloseButtonClicked.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.renderSettingModalBody() }
        </Modal.Body>
      </Modal>
    )
  }
}

function mapStateToProps (state) {
  return {
    dashboardModalStatus: state.dashboardModalStatus,
    gistTags: state.gistTags
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateDashboardModalStatus: updateDashboardModalStatus
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)