import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  transform: rotate(-0.5deg);
  width: 100vw;
  height: 60px;
  background: #ffffff;
`

const Navbar = styled.div`
  transform: rotate(0.5deg) translateY(-10px);
  background: #ffffff;
  position: fixed;
  width: 100%;
  height: 50px;
  z-index: 100;
  display: grid;

  transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);

  &.HeaderScrolled {
    padding: 1rem 0;
    backdrop-filter: blur(20px);

    a {
      color: black;
    }
  }

  @media (max-width: 640px) {
    padding: 1rem 0;

    a:nth-child(5) {
    }

    h1 {
      font-size: 14px;
    }

    p {
      font-size: 14px;
    }
  }
`

const NavGroup = styled.div`
  width: 90%;
  margin: 1.5rem auto;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  justify-items: center;

  a {
    justify-self: start;
    color: black;
    font-family: 'Orelega One';
    font-size: 18px;
  }

  h3 {
    justify-self: end;
    color: blue;
    font-family: 'Orelega One';
  }

  img {
    margin: auto;
  }

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
    justify-self: center;
    margin: 0;
  }
`

let $logocolor = 'purple'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
    this.state = {
      hasScrolled: false
    }
  }

  handleScroll = event => {
    const scrollTop = window.pageYOffset

    if (scrollTop > 50) {
      this.setState({ hasScrolled: true })
      $logocolor = 'white'
    } else {
      this.setState({ hasScrolled: true })
      $logocolor = 'purple'
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render () {
    return (
      <Container>
        <Navbar className={this.state.hasScrolled ? 'HeaderScrolled' : ''}>
          <NavGroup>
            <a href='/'>globalframes</a>
            <a href='/'>
              <h3>Connect</h3>
            </a>
          </NavGroup>
        </Navbar>
      </Container>
    )
  }
}

export default Header
