import React from "react";
import axios from "axios";
import Joke from "./ClassJoke";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = {
    numJokesToGet: 10
  }

  constructor(props) {
    super(props)
    this.state = {jokes: []}

    this.generateNewJokes = this.generateNewJokes.bind(this)
    this.vote = this.vote.bind(this)
  }

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) {
      this.retrieveJokes()
    }
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) {
      this.retrieveJokes()
    }
  }

  async retrieveJokes() {
    try {
      let jokes = this.state.jokes
      let seenJokes = new Set()

      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });

        const { status, ...joke } = res.data;
        const {id} = joke

        if (!seenJokes.has(id)) {
          seenJokes.add(id);
          jokes.push({...joke, votes: joke[id] });
        } else {
          console.error("duplicate found!");
        }
      }

      this.setJokes({jokes});
    } catch(error) {
      console.log(error)
    }
  }

  generateNewJokes() {
    this.setState(state => ({
      jokes: state.jokes.map(joke => (
        {...joke, votes: 0}
      ))
    }))
  }

  vote(id, delta) {
    const mappedJokes = state => ({
      jokes: state.jokes.map(joke =>
        joke.id ===id ? {...joke, votes: joke.votes + delta} 
          : joke)
    })

    this.setState(mappedJokes)
  }

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    
    return (
      <div>
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
        Get New Jokes
        </button>

        {sortedJokes.map(joke => (         
          <Joke 
            text={joke.joke} 
            key={joke.id}
            id={joke.id}
            votes={joke.votes}
            vote={this.vote}
          />
        ))}
      </div>
    )
  }
}

export default JokeList