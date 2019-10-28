import React, { Component } from 'react'
import { object, func } from 'prop-types'

export default class ImageAdd extends Component {
  static propTypes = {
    editorState: object,
    onChange: func,
    modifier: func
  }

  // Start the popover closed
  state = {
    url: '',
    open: false
  }

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover)
  }

  // Note: make sure whenever a click happens within the popover it is not closed
  onPopoverClick = () => {
    this.preventNextClose = true
  }

  openPopover = () => {
    const { editorState, onChange } = this.props
    const url = window.prompt('enter the image url')
    onChange(this.props.modifier(editorState, url))
    // if (!this.state.open) {
    //   this.preventNextClose = true;
    //   this.setState({
    //     open: true
    //   });
    // }
  }

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false
      })
    }

    this.preventNextClose = false
  }

  addImage = () => {
    const { editorState, onChange } = this.props
    onChange(this.props.modifier(editorState, this.state.url))
  }

  changeUrl = evt => {
    this.setState({ url: evt.target.value })
  }

  render() {
    // const popoverClassName = this.state.open
    //   ? "addImagePopover"
    //   : "addImageClosedPopover";
    // const buttonClassName = this.state.open
    //   ? "addImagePressedButton"
    //   : "addImageButton";

    return (
      <div className={`headlineButtonWrapper`}>
        <button style={{ fontSize: 12 }} className="headlineButton" onMouseUp={this.openPopover} type="button">
          img
        </button>
        {/* <div className={popoverClassName} onClick={this.onPopoverClick}>
          <input
            type="text"
            placeholder="Paste the image url …"
            className="addImageInput"
            onChange={this.changeUrl}
            value={this.state.url}
          />
          <button
            className={"addImageConfirmButton"}
            type="button"
            onClick={this.addImage}
          >
            Add
          </button>
        </div> */}
      </div>
    )
  }
}
