import React, { useState } from 'react';

const ScientificCalculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [memory, setMemory] = useState(0);
  const [isDeg, setIsDeg] = useState(true);

  const rad = deg => deg * (Math.PI / 180);

  const evaluate = () => {
    try {
      setResult(eval(expression.replace(/π/g, Math.PI).replace(/e/g, Math.E)));
    } catch {
      setResult('Error');
    }
  };

  const handleClick = val => {
    if (val === '=') return evaluate();
    if (val === 'C') {
      setExpression('');
      setResult('0');
      return;
    }
    if (val === '⌫') {
      setExpression(prev => prev.slice(0, -1));
      return;
    }
    setExpression(prev => prev + val);
  };

  const functions = {
    sin: x => Math.sin(isDeg ? rad(x) : x),
    cos: x => Math.cos(isDeg ? rad(x) : x),
    tan: x => Math.tan(isDeg ? rad(x) : x),
    sinh: x => Math.sinh(x),
    cosh: x => Math.cosh(x),
    tanh: x => Math.tanh(x),
    ln: x => Math.log(x),
    log: x => Math.log10(x),
    exp: x => Math.exp(x),
    sqrt: x => Math.sqrt(x),
    cbrt: x => Math.cbrt(x),
    abs: x => Math.abs(x),
    inv: x => 1 / x,
    factorial: x => (x === 0 ? 1 : x * functions.factorial(x - 1)),
    pow10: x => Math.pow(10, x),
    pow2: x => Math.pow(x, 2),
    pow3: x => Math.pow(x, 3),
  };

  const handleFunc = (name) => {
    try {
      const x = eval(expression.replace(/π/g, Math.PI).replace(/e/g, Math.E));
      const res = functions[name](x);
      setResult(res);
      setExpression(res.toString());
    } catch {
      setResult('Error');
    }
  };

  const buttons = [
    ['MC', 'MR', 'MS', 'M+', 'M-'],
    ['mod', 'Deg', 'Rad', '(', ')'],
    ['sinh', 'cosh', 'tanh', 'Exp', '⌫'],
    ['sinh⁻¹', 'cosh⁻¹', 'tanh⁻¹', 'log₂', 'ln'],
    ['π', 'e', 'n!', 'logₓ', 'log'],
    ['sin', 'cos', 'tan', 'xʸ', '10ˣ'],
    ['sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'x³', 'x²'],
    ['∛', '|x|', '√', '/', '%'],
    ['7', '8', '9', '*', '1/x'],
    ['4', '5', '6', '-', 'C'],
    ['1', '2', '3', '+', '+/-'],
    ['0', '.', '=', '', ''],
  ];

  const handleMemory = (cmd) => {
    const val = parseFloat(result);
    if (isNaN(val)) return;
    if (cmd === 'MS') setMemory(val);
    if (cmd === 'MR') setExpression(val.toString());
    if (cmd === 'M+') setMemory(memory + val);
    if (cmd === 'M-') setMemory(memory - val);
    if (cmd === 'MC') setMemory(0);
  };

  const renderButton = (label) => {
    const onClick = () => {
      if (label === '') return;
      if (label === 'Deg') setIsDeg(true);
      else if (label === 'Rad') setIsDeg(false);
      else if (['MS', 'MR', 'M+', 'M-', 'MC'].includes(label)) handleMemory(label);
      else if (label === '+/-') setExpression(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
      else if (label === 'n!') handleFunc('factorial');
      else if (label === 'x²') handleFunc('pow2');
      else if (label === 'x³') handleFunc('pow3');
      else if (label === 'xʸ') setExpression(prev => prev + '**');
      else if (label === '1/x') handleFunc('inv');
      else if (label === '√') handleFunc('sqrt');
      else if (label === '∛') handleFunc('cbrt');
      else if (label === '|x|') handleFunc('abs');
      else if (label === '10ˣ') handleFunc('pow10');
      else if (label === 'ln') handleFunc('ln');
      else if (label === 'log') handleFunc('log');
      else if (['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh'].includes(label)) handleFunc(label);
      else handleClick(label);
    };

    const isPrimary = ['=', 'C', '⌫'].includes(label);
    const bgColor = isPrimary
      ? label === '='
        ? 'bg-green-600'
        : 'bg-red-500'
      : 'bg-gray-200';

    const textColor = isPrimary ? 'text-white' : 'text-black';

    return (
      <button
        key={label}
        onClick={onClick}
        className={`w-14 h-10 m-1 text-sm rounded ${bgColor} ${textColor} border border-gray-300 hover:opacity-80`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-gray-300 rounded-lg shadow-lg">
      <h2 className="text-white bg-blue-600 p-2 rounded text-center text-lg font-semibold mb-2">
        Scientific Calculator
      </h2>
      <input
        type="text"
        value={expression}
        readOnly
        className="w-full p-2 text-base mb-1 bg-white border border-gray-300 rounded"
      />
      <input
        type="text"
        value={result}
        readOnly
        className="w-full p-2 text-xl font-bold text-right bg-white border border-gray-300 rounded"
      />
      <div className="flex flex-wrap justify-center mt-4">
        {buttons.flat().map(renderButton)}
      </div>
    </div>
  );
};

export default ScientificCalculator;
