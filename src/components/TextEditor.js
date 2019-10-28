/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react'
import Editor from 'draft-js-plugins-editor'
import AddImageButton from './AddImageEditor'
import { draftjsToMd, mdToDraftjs } from 'draftjs-md-converter'
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js'
import { func, string } from 'prop-types'

import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin'
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from 'draft-js-buttons'
import createImagePlugin from 'draft-js-image-plugin'
const imagePlugin = createImagePlugin()

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener('click', this.onWindowClick)
    })
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick)
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined)

  render() {
    const buttons = [HeadlineTwoButton, HeadlineThreeButton]
    return (
      <div>
        {buttons.map((
          Button,
          i // eslint-disable-next-line
        ) => (
          <Button key={i} {...this.props} />
        ))}
      </div>
    )
  }
}
HeadlinesPicker.propTypes = { onOverrideContent: func }

class HeadlinesButton extends Component {
  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker)

  render() {
    return (
      <div className="headlineButtonWrapper">
        <button onClick={this.onClick} className="headlineButton">
          H
        </button>
      </div>
    )
  }
}
HeadlinesButton.propTypes = { onOverrideContent: func }

const toolbarPlugin = createToolbarPlugin()
const { Toolbar } = toolbarPlugin
const plugins = [toolbarPlugin, imagePlugin]

export default class CustomToolbarEditor extends Component {
  constructor(props) {
    super(props)
    const contentState = this.createContentFromRaw(props.initValue)
    this.state = {
      editorState: EditorState.createWithContent(contentState)
    }
  }

  createContentFromRaw = initValue => {
    const rawData = mdToDraftjs(initValue)
    const contentState = convertFromRaw(rawData)
    return contentState
  }

  componentDidUpdate(prevProps) {
    if (prevProps && prevProps.initValue === '' && prevProps.initValue !== this.props.initValue) {
      const contentState = this.createContentFromRaw(this.props.initValue)
      this.setState({ editorState: EditorState.createWithContent(contentState) })
    }
  }
  handleMarkdown = content => {
    const md = draftjsToMd(convertToRaw(content))
    this.props.markdown(md)
  }

  onChange = editorState => {
    this.handleMarkdown(editorState.getCurrentContent())
    this.setState({
      editorState
    })
  }

  focus = () => {
    this.editor.focus()
  }

  render() {
    return (
      <div className="wrap-editor">
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            placeholder={this.props.placeholder}
            ref={element => {
              this.editor = element
            }}
          />
        </div>
        <Toolbar className="toolbars">
          {// may be use React.Fragment instead of div to improve perfomance after React 16
          externalProps => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <CodeButton {...externalProps} />
              <Separator {...externalProps} />
              <HeadlinesButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <BlockquoteButton {...externalProps} />
              <CodeBlockButton {...externalProps} />
              <AddImageButton
                editorState={this.state.editorState}
                onChange={this.onChange}
                modifier={imagePlugin.addImage}
              />
            </div>
          )}
        </Toolbar>
      </div>
    )
  }
}
CustomToolbarEditor.propTypes = {
  markdown: func,
  placeholder: string,
  initValue: string
}
