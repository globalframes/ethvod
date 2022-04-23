import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import Upload from './components/Upload'
import Stream from './components/Stream'

const Container = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  grid-gap: 30px;
`

function Comp () {
  const VIEWSTATES = {
    showform: 1
  }

  const [viewstate, setViewstate] = React.useState(VIEWSTATES.showform)

  switch (viewstate) {
    case VIEWSTATES.showform:
      return (
        <Container>
          <Upload
            onUploaded={() => {
              // setViewstate(VIEWSTATES);
            }}
          />
          <Stream
            onStreaming={() => {
              // setViewstate(VIEWSTATES);
            }}
          />
        </Container>
      )
  }
}

export default Comp
