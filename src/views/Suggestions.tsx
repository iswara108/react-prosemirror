import * as React from 'react'

import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import {
  SuggestionActionType,
  SuggestionStateType
} from '../hooks/useTaggingState'

const StyledPopper = styled(Popper)`
  z-index: 100;
`

export function Suggestions({
  suggestionState,
  suggestionDispatch
}: {
  suggestionState: SuggestionStateType
  suggestionDispatch: React.Dispatch<SuggestionActionType>
}) {
  const handleClose: (
    event: React.MouseEvent<Document, MouseEvent>
  ) => void = event => {
    console.log('closed', event.target)
    suggestionDispatch({
      type: 'resolve tag',
      payload: (event.target as Element).textContent || ''
    })
  }
  const handleSelect: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void = event => {
    console.log('closed', event.target)
    suggestionDispatch({
      type: 'resolve tag',
      payload: (event.target as Element).textContent || ''
    })
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      console.log('should close now')
    }
  }

  return (
    <>
      <StyledPopper
        open={!!suggestionState.potentialTag}
        anchorEl={document.querySelector('.editing-hashtag')}
        role={undefined}
        disablePortal
        placement="bottom-start"
      >
        {() => (
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
              >
                {suggestionState.hashtagSuggestions?.map(suggestion => (
                  <MenuItem key={suggestion} onClick={handleSelect}>
                    {suggestion}
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        )}
      </StyledPopper>
    </>
  )
}
