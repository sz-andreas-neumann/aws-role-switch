import React, { FC, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import validateColor from "validate-color";
import { Button, ControlGroup, Icon, InputGroup, Menu, MenuItem } from "@blueprintjs/core";
import { useColorScheme, useKeydown } from '../common/hooks';
import { mapConfigStateToGroups, openOptions } from './util';
import { AWSConfigItemState } from '../types';
import { useConfig } from './hooks/useConfig';
import awsIconDark from '../assets/aws-dark.svg'
import awsIconLight from '../assets/aws-light.svg'

const MenuSection: FC<{ title: string }> = ({ title }) => {
  return <div className="menu-divider">{title}</div>
};

const RoleItem: FC<AWSConfigItemState> = ({ title, aws_account_id, color, selected = false }) => {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [selected])

  return (
    <div ref={ref}>
      <MenuItem
        onClick={() => window.close()}
        selected={selected}
        icon={
          <Icon 
            icon="full-circle" 
            color={validateColor(color as string) ? color : undefined} 
            />} 
        text={title} 
        label={aws_account_id} />
    </div>
  )
}

const App = () => {
  const theme = useColorScheme();
  const [ roles, filter, setFilter, selectIdx ] = useConfig();

  const selectIdxRef = useRef(selectIdx)
  const rolesRef = useRef(roles)

  // update refs to use them in document listeners
  useEffect(() => {
    selectIdxRef.current = selectIdx
    rolesRef.current = roles
  }, [selectIdx, roles]);

  useKeydown((evt: KeyboardEvent) => {
    if (selectIdxRef.current !== null && evt.key === 'Enter') {
      // console.log(`Selected aws profile: ${rolesRef.current[selectIdxRef.current].title} ${selectIdxRef.current}`)
      window.close()
    }
  });

  return (
    <div id="popup" className={`wrapper bp4-${theme}`}>
      <ControlGroup className="header">
        <InputGroup 
          className="filter"
          value={filter}
          onChange={(evt) => setFilter(evt.target.value)}
          leftIcon="filter"
          placeholder="Filter...."
          autoFocus={true} />
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: 10 }}>
          <Button icon={
            <img src={theme == 'dark' ? awsIconDark : awsIconLight} className="bp4-icon" />
          } minimal={true}></Button>
          <Button onClick={openOptions} icon="wrench" minimal={true}></Button>
        </div>
      </ControlGroup>
      <Menu className="menu">
        {/* TODO: handle empty state */}
        {mapConfigStateToGroups(roles).map((group, gid) => (
          <div key={group.title+gid}>
            {group.title == 'undefined' ? null : <MenuSection title={group.title} />}
            {group.children.map((role, idx) => <RoleItem {...role} key={role.aws_account_id+idx} />)}
          </div>
        ))}
      </Menu>
    </div>
  )
}

render(<App />, document.getElementById('root'));
