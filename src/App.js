import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import axios from 'axios';
import './App.css';

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])

  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
    .then(res => {
      setCategories(res.data.trivia_categories)
    })
  }, [])


  // hack for html string formatting
  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios.get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map((item, index) => {
        const options = [
          ...item.incorrect_answers.map(a => decodeString(a)), 
          decodeString(item.correct_answer)
        ]
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(item.question),
          answer: decodeString(item.correct_answer),
          options: options.sort(() => Math.random()-.5)
        }
      }))
    })
  }

  return (
    <>
      <h1>Trivia Flashcards</h1>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map(category => {
              return(<option value={category.id} key={category.id}>{category.name}</option>)
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of questions</label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>

      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}


export default App;
