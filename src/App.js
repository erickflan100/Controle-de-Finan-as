import React, { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [desc, setDesc] = useState('')
  const [val, setVal] = useState('')
  const [expense, setExpense] = useState(false)
  
  const data = localStorage.getItem("transaction")
  const [transactionList, setTransactionList] = useState(
    data ? JSON.parse(data) : []
    )
    
  const [result, setResult] = useState([
    {
      descri: '',
      valor: 0
    }
  ])
  const [entrada, setEntrada] = useState(0)
  const [saida, setSaida] = useState(0)
  const [saldo, setSaldo] = useState(0)

  const generationId = () => Math.round(Math.random() * 1000)
  
  
  useEffect(() => {
    
    const dadosDesc = transactionList
      .filter((item) => item.desc)
      .map((transaction) => String(transaction.desc))

    const valor = transactionList
      .filter((item) => item.val)
      .map((transaction) => Number(transaction.val))
    
    const amountSaida = transactionList
      .filter((item) => item.expense)
      .map((transaction) => Number(transaction.val))

    const amountEntrada = transactionList
      .filter((item) => !item.expense)
      .map((transaction) => Number(transaction.val))

    
    const saida = amountSaida.reduce((acc, cur) => acc + cur, 0).toFixed(2)
    const entrada = amountEntrada.reduce((acc, cur) => acc + cur, 0).toFixed(2)

    const total = Math.abs(entrada - saida).toFixed(2)
  
    setResult({descri: dadosDesc, valor: valor})
    setEntrada(`R$ ${entrada}`)
    setSaida(`R$ ${saida}`)
    setSaldo(`${Number(entrada) < Number(saida) ? '-' : ""}R$ ${total}`)

  },[transactionList])

  const handleAdd = (transaction) => {
    const newArrayTransaction = [...transactionList, transaction]

    setTransactionList(newArrayTransaction)

    localStorage.setItem("transaction", JSON.stringify(newArrayTransaction))
  }

  const handleSave = () => {
    if(!desc || !val) {
      alert("Adicione a Descrição e o Valor")
    }else if (val < 1){
      alert("Valor tem que ser positivo!")
    }else{
      const transaction = {
        id: generationId(),
        desc: desc,
        val: val,
        expense: expense
      }
      
      handleAdd(transaction)

      setDesc('')
      setVal('')
    }
  }

  const handleClear = () => {
    localStorage.clear()
    window.location.reload()
  }
  console.log(result)
  return (
    <div className="container">
      <h1>Finanças</h1>
      <button onClick={handleClear}>Limpar</button>
      <div className='info'>
        <div className='val1'>
          ENTRADA<br/>
          {entrada}
        </div>
        <div className='val2'>
          SAÍDA<br/>
          {saida}
        </div>
        <div className='val3'>
          SALDO<br/>
          {saldo}
        </div>
      </div>
      <div className='dados'>
        <div className='dadosAdd'>
          <input className='insert' value={desc} placeholder='Descrição' onChange={(e) => setDesc(e.target.value)}/>
          <input className='insert' value={val} type='number' placeholder='Valor' onChange={(e) => setVal(e.target.value)}/>
          <input className='radio' type='radio' name='group1' defaultChecked id='entrada' onChange={() => setExpense(!expense)}/>
          <div className='nameRadio' htmlFor="entrada">Entrada</div>
          <input className='radio' type='radio' name='group1' id='saida' onChange={() => setExpense(!expense)}/>
          <div className='nameRadio' htmlFor="saida">Saída</div>
          <button className='btn' onClick={handleSave}>Adicionar</button>
        </div>
        <ul>
          {transactionList.map((item, index) => (
            <div>
              <li className='dadosPostados' key={index}>
                <div className='row'> 
                  {item.desc}
                  {item.expense === true ? 
                      (
                        <div className='true'>
                          R$ {parseInt(item.val).toFixed(2)}
                        </div>
                      ) : (
                        <div className='false'>
                          R$ {parseInt(item.val).toFixed(2)}
                        </div>
                      )
                  }
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;