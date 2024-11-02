---
title: Web Canvas API 활용하여 GPT와 캐치마인드 하기 (1 of 3)
date: "2024-11-02"
description: 프론트엔트 페이지 만들기
category: React
---

## 배경

고전 게임 중에서 캐치마인드 라는 그림을 그리는 게임이 있다. 매턴마다 돌아가면서 그림을 그리는 사람이 정해진다. 자기 차례가 돌아오면 특정 키워드가 랜덤으로 주어지며, 그 그림에 맞게 그림을 그리는 것이다. 나머지 사람들은 그 그림을 보고 키워드를 맞추면 점수를 얻는 방식이다.

![catch-mind](https://github.com/user-attachments/assets/94b015c3-a47d-4f93-92f1-eb702f15e5c1)
_출처 : 캐치마인드 개드립 걸작선 게시판_

이 게임 방식에서 착안하여 웹 페이지에서 그림 퀴즈를 내는 것이 가능할까 생각하게 되었다. 그래서 이번 사이드 프로젝트에서는 캐치마인드 게임을 웹 페이지에서 구현해보려고 한다. 그런데 나는 한가지 변주를 주려고 한다. 실제 캐치마인드 게임에서는 게임이 진행되기 위해서는 최소 3명이 있어야 한다. 하지만 바쁜 현대사회에서 사는 우리들은 3명을 기다릴 여유가 없다. 싱글플레이가 가능한 캐치마인드를 만들어 보려고 한다. 그럼 누가 문제를 맞추냐고? 그래서 그림을 맞추는 주체를 '사람' 이 아니라 GPT 로 바꿔보려고 한다.

좀 더 기술적으로 풀어서 설명하자면, Web Canvas API(+React.js)를 활용하여 웹페이지에서 그림을 그린 다음, JPG나 PNG 파일로 저장하고 이를 OpenAI API에 전달하여 키워드를 추론하게 하는 방법이다.

## 프로젝트 준비

프론트엔드에서는 Vanilla JS 만으로도 Canvas API를 활용하여 그림을 그릴 수도 있지만, React.js를 활용하면 좀 더 편하게 그림을 그릴 수 있다. 또한, React.js를 활용하면 컴포넌트 단위로 관리할 수 있어서 코드의 가독성도 좋아진다. 따라서 이번 프로젝트에서는 React.js를 활용하여 그림을 그리는 방법을 사용하였다.

백엔드에서는 Node.js(+Express)를 활용하였다. 사실 프론트엔드 -> OpenAI API를 직접 호출해서 결과를 받아오는 것도 가능하지만 이를 위해선 호출 할 때 API_KEY를 넣어줘야 한다. 다음 포스팅에서도 언급하겠지만,현재 OpenAI에서 무료 크레딧을 제공하는 정책이 막힌 것으로 보여, API를 호출하기 위해서는 현재로선 과금을 할 수 밖에 없는 상태이다(나는 이번 프로젝트를 위해 실제로 과금을 진행했다).

브라우저에서 API_KEY를 넣게 되면 사용자에게 노출될 수 밖에 없기 때문에, 별도의 백엔드 서버를 두어서 호출하기로 했다. 따라서 이번 프로젝트에서는 백엔드에서 Node.js(+Express)를 활용하여 호출하는 방법을 사용하였다.

## React로 프론트엔드 페이지 구성

내가 프로젝트를 끌고나가는 방식 중에 선호하는 방식은, 처음에는 가장 쉽고 간단한 기능만 구현해본다. 이후에 조금 더 복잡한 기능을 덧붙여 나가는 방식이다. 따라서 이번 프로젝트에서는 가장 먼저 캔버스를 구성하는 방법을 설명하고, 이후에 조금 더 다양한 기능(색상 선택, 지우개, 이미지 저장, GPT 연동)을 덧붙여 나가는 방법을 설명하려고 한다.

### Step 1. 기본 캔버스 구성

가장 먼저 캔버스, 즉 그림을 그릴 수 있는 영역을 구성해야 한다. 이를 위해서는 `<canvas>` 태그를 사용하면 된다. 캔버스 태그는 그림을 그리는 영역을 정의하는 태그로, 웹 페이지에서 그림을 그리는 데 사용된다.

![step-1](https://github.com/user-attachments/assets/0178547a-c7a1-41cb-a795-3982d913a9e9)

<details>
<summary>
<code>Canvas.tsx</code>
</summary>

```tsx
// Canvas.tsx
import React, { useRef, useEffect, useState } from "react"

interface CanvasProps {
  width?: number
  height?: number
}

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    setContext(ctx)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.beginPath()
    context.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.lineTo(offsetX, offsetY)
    context.stroke()
  }

  const stopDrawing = (): void => {
    if (!context) return

    context.closePath()
    setIsDrawing(false)
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
    />
  )
}

export default Canvas
```

</details>

### Step 2. 색상 선택 기능

아직까지는 검정색으로만 그림을 그릴 수 있다. 하지마 이는 너무 단조로우므로 색상을 선택할 수 있는 기능을 추가해보자. 이를 위해서는 `<input type="color">` 태그를 사용하여 색상을 선택할 수 있는 영역을 만들고, 이를 통해 선택한 색상을 캔버스에 적용하면 된다.

![step-2](https://github.com/user-attachments/assets/fe033773-a234-457b-84e0-4d0e6414af08)

<details>
<summary>
<code>Canvas.tsx</code>
</summary>

```tsx
import React, { useRef, useEffect, useState } from "react"

interface CanvasProps {
  width?: number
  height?: number
}

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [currentColor, setCurrentColor] = useState<string>("#000000")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = currentColor
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    setContext(ctx)
  }, [])

  useEffect(() => {
    if (!context) return
    context.strokeStyle = currentColor
  }, [currentColor, context])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.beginPath()
    context.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.lineTo(offsetX, offsetY)
    context.stroke()
  }

  const stopDrawing = (): void => {
    if (!context) return

    context.closePath()
    setIsDrawing(false)
  }

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="colorPicker" style={{ marginRight: "0.5rem" }}>
          색상 선택:
        </label>
        <input
          id="colorPicker"
          type="color"
          value={currentColor}
          onChange={e => setCurrentColor(e.target.value)}
        />
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  )
}

export default Canvas
```

</details>

### Step 3. 지우개 기능

현재까지는 그림을 그리는 기능만 있기 때문에 잘못 그리게 되면 페이지를 새로고침 해야하는 번거로움이 있다. 그래서 지울 수 있는 기능을 제공해보자. 지우개 기능이 활성화 되면 `context.globalCompositeOperation` 을 `destination-out` 으로 설정하여 지우개 모드를 활성화 한다.
![step-3](https://github.com/user-attachments/assets/592135d9-00f4-4ca8-a338-cfcd6a4a5eb3)

<details>
<summary>
<code>Canvas.tsx</code>
</summary>

```tsx
import React, { useRef, useEffect, useState } from "react"

interface CanvasProps {
  width?: number
  height?: number
}

type DrawingMode = "draw" | "erase"

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [currentColor, setCurrentColor] = useState<string>("#000000")
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("draw")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = currentColor
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    setContext(ctx)
  }, [])

  useEffect(() => {
    if (!context) return

    if (drawingMode === "erase") {
      context.globalCompositeOperation = "destination-out"
      context.strokeStyle = "rgba(0,0,0,1)"
    } else {
      context.globalCompositeOperation = "source-over"
      context.strokeStyle = currentColor
    }
  }, [drawingMode, currentColor, context])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.beginPath()
    context.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.lineTo(offsetX, offsetY)
    context.stroke()
  }

  const stopDrawing = (): void => {
    if (!context) return

    context.closePath()
    setIsDrawing(false)
  }

  const toggleMode = () => {
    setDrawingMode(prev => (prev === "draw" ? "erase" : "draw"))
  }

  return (
    <div>
      <div>
        <div>
          <label htmlFor="colorPicker" style={{ marginRight: "0.5rem" }}>
            색상 선택:
          </label>
          <input
            id="colorPicker"
            type="color"
            value={currentColor}
            onChange={e => setCurrentColor(e.target.value)}
            disabled={drawingMode === "erase"}
          />
        </div>

        <button onClick={toggleMode}>
          {drawingMode === "draw" ? "지우개 모드" : "그리기 모드"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: "1px solid black",
          cursor: drawingMode === "erase" ? "crosshair" : "default",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  )
}

export default Canvas
```

</details>

### Step 4. 이미지 저장 기능, hook으로 분리

캔버스에 그린 그림의 이미지를 저장하는 기능을 추가해보자. 이를 위해서는 `canvas.toDataURL()` 메서드를 사용하면 된다. 이 메서드는 캔버스에 그려진 이미지를 PNG 형식의 데이터로 변환된다. 그래서 '이미지 저장' 버튼을 누르면 로컬 저장소에 이미지가 저장된다.

그리고 점점 캔버스에서 처리해야하는 비즈니스 로직이 늘어남에 따라 `Canvas.tsx` 파일이 복잡해지는 것을 방지하기 위해 `useCanvas` 이라는 훅으로 만들어서 분리하기로 했다.

```tsx
// Canvas.tsx
import React from "react"
import { useCanvas } from "../hooks/useCanvas"

interface CanvasProps {
  width?: number
  height?: number
}

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 600 }) => {
  const {
    canvasRef,
    currentColor,
    drawingMode,
    startDrawing,
    draw,
    stopDrawing,
    setCurrentColor,
    toggleMode,
    saveImage,
  } = useCanvas({ width, height })

  return (
    <div>
      <div>
        <div>
          <label htmlFor="colorPicker" style={{ marginRight: "0.5rem" }}>
            색상 선택:
          </label>
          <input
            id="colorPicker"
            type="color"
            value={currentColor}
            onChange={e => setCurrentColor(e.target.value)}
            disabled={drawingMode === "erase"}
          />
        </div>

        <button onClick={toggleMode}>
          {drawingMode === "draw" ? "지우개 모드" : "그리기 모드"}
        </button>

        <button onClick={saveImage}>이미지 저장</button>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: "1px solid black",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  )
}

export default Canvas
```

</details>

<details>
<summary>
<code>useCanvas.ts</code>
</summary>

```ts
// useCanvas.ts
import { useRef, useState, useEffect } from "react"

type DrawingMode = "draw" | "erase"

interface UseCanvasProps {
  width: number
  height: number
}

export const useCanvas = ({ width, height }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [currentColor, setCurrentColor] = useState<string>("#000000")
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("draw")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = currentColor
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    setContext(ctx)
  }, [])

  useEffect(() => {
    if (!context) return

    if (drawingMode === "erase") {
      context.globalCompositeOperation = "destination-out"
      context.strokeStyle = "rgba(0,0,0,1)"
    } else {
      context.globalCompositeOperation = "source-over"
      context.strokeStyle = currentColor
    }
  }, [drawingMode, currentColor, context])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.beginPath()
    context.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.lineTo(offsetX, offsetY)
    context.stroke()
  }

  const stopDrawing = (): void => {
    if (!context) return

    context.closePath()
    setIsDrawing(false)
  }

  const toggleMode = () => {
    setDrawingMode(prev => (prev === "draw" ? "erase" : "draw"))
  }

  const saveImage = () => {
    if (!canvasRef.current) return

    const date = new Date()
    const fileName = `drawing-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}-${date
      .getHours()
      .toString()
      .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`

    const image = canvasRef.current.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `${fileName}.png`
    link.href = image
    link.click()
  }

  return {
    canvasRef,
    currentColor,
    drawingMode,
    startDrawing,
    draw,
    stopDrawing,
    setCurrentColor,
    toggleMode,
    saveImage,
  }
}
```

</details>

## 그 이후 구현

이 이후에는 본인의 입맛에 맞춘 스타일링과 기능등을 추가하면 될 것이다. 나는 우선 `tailwindcss`를 활용하여 최소한의 스타일링을 하고, 그 외에 '색상 팔레트'와 '전체 지우기' 기능을 추가하였다. 각종 버튼을 담당하는 UI는 별도 컴포넌트인 `CanvasController.tsx` 파일로 분리했다.

<details>
<summary>
<code>Canvas.tsx</code>
</summary>

```tsx
// Canvas.tsx
import { useCanvas } from "../hooks/useCanvas"
import { CanvasController } from "./CanvasController"

interface CanvasProps {
  width?: number
  height?: number
}

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 600 }) => {
  const {
    canvasRef,
    currentColor,
    drawingMode,
    startDrawing,
    draw,
    stopDrawing,
    setCurrentColor,
    toggleMode,
    saveImage,
    clearCanvas,
  } = useCanvas({ width, height })

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`
          border border-gray-300 rounded-lg
          ${drawingMode === "erase" ? "cursor-cell" : "cursor-crosshair"}
        `}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      <CanvasController
        currentColor={currentColor}
        drawingMode={drawingMode}
        setCurrentColor={setCurrentColor}
        toggleMode={toggleMode}
        saveImage={saveImage}
        clearCanvas={clearCanvas}
      />
    </div>
  )
}

export default Canvas
```

</details>

<details>
<summary>
<code>useCanvas.ts</code>
</summary>

```ts
// useCanvas.ts
import { useRef, useState, useEffect } from "react"

type DrawingMode = "draw" | "erase"

interface UseCanvasProps {
  width: number
  height: number
}

// 색상 상수 추가
export const COLORS = {
  BLACK: "#000000",
  RED: "#FF0000",
  BLUE: "#0000FF",
  GREEN: "#008000",
  YELLOW: "#FFD700",
} as const

export const useCanvas = ({ width, height }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [currentColor, setCurrentColor] = useState<string>(COLORS.BLACK)
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("draw")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = currentColor
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    setContext(ctx)
  }, [])

  useEffect(() => {
    if (!context) return

    if (drawingMode === "erase") {
      context.globalCompositeOperation = "destination-out"
      context.strokeStyle = "rgba(0,0,0,1)"
    } else {
      context.globalCompositeOperation = "source-over"
      context.strokeStyle = currentColor
    }
  }, [drawingMode, currentColor, context])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.beginPath()
    context.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !context) return

    const { offsetX, offsetY } = e.nativeEvent
    context.lineTo(offsetX, offsetY)
    context.stroke()
  }

  const stopDrawing = (): void => {
    if (!context) return

    context.closePath()
    setIsDrawing(false)
  }

  const toggleMode = () => {
    setDrawingMode(prev => (prev === "draw" ? "erase" : "draw"))
  }

  const saveImage = () => {
    if (!canvasRef.current) return

    const date = new Date()
    const fileName = `drawing-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}-${date
      .getHours()
      .toString()
      .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`

    const image = canvasRef.current.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `${fileName}.png`
    link.href = image
    link.click()
  }

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return

    // 캔버스 전체 지우기
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  return {
    canvasRef,
    currentColor,
    drawingMode,
    startDrawing,
    draw,
    stopDrawing,
    setCurrentColor,
    toggleMode,
    saveImage,
    clearCanvas,
  }
}
```

</details>

<details>
<summary>
<code>CanvasController.tsx</code>
</summary>

```tsx
// CanvasController.tsx
import React from "react"
import { COLORS } from "../hooks/useCanvas"
import { useCanvasController } from "../hooks/useCanvasController"

interface ColorButtonProps {
  color: string
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
}

const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  isSelected,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-8 h-8 rounded-full transition-all
      ${isSelected ? "ring-2 ring-offset-2 ring-gray-400" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
    `}
    style={{ backgroundColor: color }}
    aria-label={`Select ${color} color`}
  />
)

interface CanvasControllerProps {
  currentColor: string
  drawingMode: "draw" | "erase"
  setCurrentColor: (color: string) => void
  toggleMode: () => void
  saveImage: () => void
  clearCanvas: () => void
}

export const CanvasController: React.FC<CanvasControllerProps> = props => {
  const {
    currentColor,
    drawingMode,
    setCurrentColor,
    toggleMode,
    saveImage,
    clearCanvas,
  } = useCanvasController(props)

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="mr-2">색상:</span>
        <div className="flex gap-2">
          {Object.entries(COLORS).map(([name, color]) => (
            <ColorButton
              key={color}
              color={color}
              isSelected={currentColor === color}
              onClick={() => setCurrentColor(color)}
              disabled={drawingMode === "erase"}
            />
          ))}
        </div>
      </div>

      <button
        onClick={toggleMode}
        className={`
          px-4 py-2 rounded-md text-white transition-colors
          ${
            drawingMode === "erase"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }
        `}
      >
        {drawingMode === "draw" ? "지우개 모드" : "그리기 모드"}
      </button>

      <button
        onClick={saveImage}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
      >
        이미지 저장
      </button>

      <button
        onClick={clearCanvas}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
      >
        전체 지우기
      </button>
    </div>
  )
}
```

</details>

프론트엔드 페이지의 Github은 [이곳](https://github.com/hjhj97/gpt-drawing-quiz.frontend)에서 확인해 볼 수 있다.

다음 포스팅에서부터는 OpenAI API를 사이트에서 API_KEY를 발급받고 express를 기반으로 간단한 API 서버를 구성할 것이다. 이를 통해 캔버스에 그린 그림을 저장하고, 이를 OpenAI API에 전달하여 키워드를 추론하는 방법을 설명하려고 한다.
