/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback } from "react";
import { evaluate } from "mathjs";
import "../styles/Calculator.css";

// مكون زر الآلة الحاسبة
const CalculatorButton = ({ value, onClick }) => (
  <button onClick={() => onClick(value)}>{value}</button>
);

const Calculator = () => {
  const [input, setInput] = useState(""); // لتخزين المدخلات
  const [result, setResult] = useState(""); // لتخزين النتيجة
  const [memory, setMemory] = useState(null); // لتخزين الذاكرة
  const [history, setHistory] = useState([]); // لتخزين سجل العمليات
  const [isDarkMode, setIsDarkMode] = useState(false); // للتحكم في الوضع الليلي

  // التعامل مع ضغط الأزرار أو الكيبورد
  const handleClick = useCallback(
    (value) => {
      if (value === "=" || value === "Enter") {
        try {
          const calculatedResult = evaluate(input); // حساب المدخلات بأمان
          setResult(calculatedResult);
          setInput(calculatedResult.toString());
          setHistory([...history, `${input} = ${calculatedResult}`]); // إضافة العملية إلى السجل
        } catch {
          setResult("Invalid Operation");
        }
      } else if (value === "C" || value === "Escape") {
        setInput("");
        setResult("");
      } else if (value === "←") {
        setInput(input.slice(0, -1)); // حذف آخر حرف
      } else if (value === "±") {
        if (input) {
          setInput((prev) =>
            prev.startsWith("-") ? prev.slice(1) : `-${prev}`
          );
        }
      } else if (value === "M+") {
        setMemory(input || result); // حفظ في الذاكرة
      } else if (value === "MR") {
        setInput(memory || ""); // استرجاع من الذاكرة
      } else if (value === "MC") {
        setMemory(null); // مسح الذاكرة
      } else if (/^[0-9.+\-*/()]$/.test(value)) {
        if (result && input === result.toString()) {
          setInput(result + value);
        } else {
          setInput(input + value);
        }
        setResult("");
      }
    },
    [input, result, memory, history] // إضافة history في الـ useCallback
  );

  // التعامل مع إدخال لوحة المفاتيح
  useEffect(() => {
    const handleKeyPress = (event) => handleClick(event.key);
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleClick]);

  // حفظ المدخلات والنتائج والسجل في Local Storage
  useEffect(() => {
    localStorage.setItem("input", input);
    localStorage.setItem("result", result);
    localStorage.setItem("history", JSON.stringify(history));
  }, [input, result, history]);

  // استرجاع المدخلات والنتائج من Local Storage عند تحميل التطبيق
  useEffect(() => {
    setInput(localStorage.getItem("input") || "");
    setResult(localStorage.getItem("result") || "");
    setHistory(JSON.parse(localStorage.getItem("history")) || []);
  }, []);

  // قائمة الأزرار
  const BUTTONS = [
    "±",
    "M+",
    "MR",
    "MC",
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
    "C",
    "←",
  ];

  return (
    <div className={`calculator ${isDarkMode ? "dark" : "light"}`}>
      {/* زر التحكم في الوضع الليلي */}
      <button
        className="dark-mode-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* عرض المدخلات أو النتيجة */}
      <div className="display">
        <div className="operation-display">{input || "0"}</div>
        {result && <div className="result">{result}</div>}
      </div>

      {/* الأزرار */}
      <div className="buttons">
        {BUTTONS.map((btn, index) => (
          <CalculatorButton key={index} value={btn} onClick={handleClick} />
        ))}
      </div>

      {/* سجل العمليات */}
      <div className="history">
        <h3>History:</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
