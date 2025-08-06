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

  return (
    <div className={styles.layout}>
      <Header title={title} setTitle={setTitle} shapes={shapes} setShapes={setShapes} />

      <div style={{ padding: '1rem' }}>
        <button onClick={handleSave}>SAVE</button>
        <button onClick={handleLoad}>LOAD</button>
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
