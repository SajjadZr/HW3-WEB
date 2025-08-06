import { useState } from 'react'
import styles from './styles.module.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Board from './Board';
import Counter from './Counter';
import type { Shape, ShapeType } from './configs';

import { savePainting, getPaintings } from '../api/paintings';

function App() {

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [title, setTitle] = useState("Painting");
  const [selectedPainting, setSelectedPainting] = useState<ShapeType | null>(null)

  const [userName] = useState("test-user");

  const addShape = (shape: Shape) => {
    const newShapes = [...shapes];
    newShapes.push(shape);
    setShapes(newShapes);
  };

  const removeShape = (shapeIndex: number) => {
    const newShapes = [...shapes];
    newShapes.splice(shapeIndex, 1);
    setShapes(newShapes);
  }

  const handleSave = async () => {
    const painting = {
      userName,
      title,
      createdAt: new Date().toISOString(),
      boardData: shapes,
    };
    await savePainting(painting);
    alert("paint seved");
  };

  const handleLoad = async () => {
    const allPaintings = await getPaintings();
    if (allPaintings.length === 0) return alert("not found");
    const latest = allPaintings[allPaintings.length - 1];
    setTitle(latest.title);
    setShapes(latest.boardData);
    alert("paint loaded");
  };

  const handleExport = () => {
  const data = {
    title,
    boardData: shapes,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.json`;
  a.click();
  };


  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result as string);
      if (!parsed.boardData) return alert("invalid format");
      setTitle(parsed.title || "Imported");
      setShapes(parsed.boardData);
      alert("import successfully");
    } catch (err) {
      alert("error in reading file.");
    }
  };
  reader.readAsText(file);
  };


  return (
    <div className={styles.layout}>
      <Header title={title} setTitle={setTitle} shapes={shapes} setShapes={setShapes} />

      <div style={{ padding: '1rem' }}>
        <button onClick={handleSave}>SAVE</button>
        <button onClick={handleLoad}>LOAD</button>
        <button onClick={handleExport}>Json Output</button>
        <label style={{ marginLeft: '1rem' }}>loading file
        <input type="file" accept=".json" onChange={handleImport} />
        </label>
      </div>

      <div className={styles.contents}>
        <div className={styles.boardAndCounterWrapper}>
          <Board
            addShape={addShape}
            selectedPainting={selectedPainting}
            setSelectedPainting={setSelectedPainting}
            shapes={shapes}
            removeShape={removeShape}
          />
          <Counter shapes={shapes}/>
        </div>

        <Sidebar
          selectedPainting={selectedPainting}
          setSelectedPainting={setSelectedPainting}
        />
      </div>
    </div>
  )
}

export default App