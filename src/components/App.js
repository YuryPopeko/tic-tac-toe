import React from 'react';

import '../styles/App.css';

const X = 'X';
const O = 'O';
const ASC = 'ASC';
const DESC = 'DESC';

function Square(props) {
  const { onClick, value, highlight } = props;
  const classes = typeof highlight === 'number' ? 'square highlight' : 'square';

  return (
    <button className={classes} onClick={onClick}>
      {value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const { squares, onClick, winningLine } = this.props;
    const highlight = winningLine && winningLine.find(item => item === i);

    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
        key={i}
        highlight={highlight}
      />
    );
  }

  renderField() {
    const field = [];

    for (let square = 0; square < 9; square++) {
      field.push(this.renderSquare(square));
    }

    return <div className='field'>{field}</div>;
  }

  render() {
    return (
      <div>
        <div className='status'>{this.props.status}</div>
        {this.renderField()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), pos: null }],
      stepNumber: 0,
      stepSort: ASC,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (getwinningLine(squares || squares[i]) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? X : O;
    this.setState({
      history: history.concat([{ squares: squares, pos: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step, { target: btn }) {
    const selected = document.querySelector('ol .selected');

    selected && selected.classList.remove('selected');
    btn.classList.add('selected');
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  sortSteps() {
    this.setState({
      stepSort: this.state.stepSort === ASC ? DESC : ASC
    });
  }

  render() {
    const { history } = this.state;
    const current = history[this.state.stepNumber];
    const { squares } = current;
    const isFieldFull = squares.every(item => item);
    const winningLine = getwinningLine(squares);
    const winner = winningLine ? squares[winningLine[0]] : null;

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to step # ${move} ${getCoords(history[move].pos)}`
        : 'To begin';

      return (
        <li key={move}>
          <button onClick={e => this.jumpTo(move, e)}>{desc}</button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = `Winner is ${winner}`;
    } else if (isFieldFull) {
      status = "It's a tie";
    } else {
      status = `Next player is ${this.state.xIsNext ? X : O}`;
    }

    return (
      <div className='game'>
        <Board
          squares={current.squares}
          onClick={i => this.handleClick(i)}
          status={status}
          winningLine={winningLine}
        />
        <ol>{this.state.stepSort === ASC ? moves : moves.reverse()}</ol>
        <button onClick={() => this.sortSteps()}>{this.state.stepSort}</button>
      </div>
    );
  }
}

function getwinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let line of lines) {
    const [a, b, c] = line;

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

const getCoords = i => `(${(i % 3) + 1}, ${~~(i / 3) + 1})`;

export default Game;
