'use client'

import { useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/player-store'
import { getAnalyser } from '@/lib/audio-context'

const NUM_BARS = 60
const BAR_GAP = 3

function getBarColor(ctx: CanvasRenderingContext2D, x: number, barHeight: number, canvasHeight: number, amplitude: number): CanvasGradient {
  const centerY = canvasHeight / 2
  const grad = ctx.createLinearGradient(x, centerY - barHeight, x, centerY)

  const bright = 0.6 + amplitude * 0.8

  grad.addColorStop(0, `rgba(${Math.min(255, Math.floor(180 * bright))}, ${Math.min(255, Math.floor(220 * bright))}, 255, 0.95)`)
  grad.addColorStop(0.35, `rgba(${Math.min(255, Math.floor(58 * bright * 1.4))}, ${Math.min(255, Math.floor(121 * bright * 1.4))}, ${Math.min(255, Math.floor(227 * bright * 1.4))}, 0.95)`)
  grad.addColorStop(0.7, `rgba(${Math.min(255, Math.floor(30 * bright))}, ${Math.min(255, Math.floor(70 * bright))}, ${Math.min(255, Math.floor(180 * bright))}, 0.95)`)
  grad.addColorStop(1, `rgba(${Math.min(255, Math.floor(15 * bright))}, ${Math.min(255, Math.floor(40 * bright))}, ${Math.min(255, Math.floor(120 * bright))}, 0.9)`)

  return grad
}

export function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const { currentBeatId, visualizerSensitivity } = usePlayer()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    setSize()
    window.addEventListener('resize', setSize)

    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      timeRef.current += 0.016

      const W = canvas.width / window.devicePixelRatio
      const H = canvas.height / window.devicePixelRatio
      const centerY = H / 2

      ctx.clearRect(0, 0, W, H)

      const analyser = getAnalyser()
      const isPlaying = !!currentBeatId && !!analyser

      if (!isPlaying) {
        const breathe = Math.sin(timeRef.current * 1.2) * 0.4 + 1

        ctx.shadowColor = '#3A79E3'
        ctx.shadowBlur = 10 * breathe

        const lineGrad = ctx.createLinearGradient(0, 0, W, 0)
        lineGrad.addColorStop(0, 'rgba(58, 121, 227, 0)')
        lineGrad.addColorStop(0.1, 'rgba(58, 121, 227, 0.6)')
        lineGrad.addColorStop(0.5, 'rgba(58, 121, 227, 1)')
        lineGrad.addColorStop(0.9, 'rgba(58, 121, 227, 0.6)')
        lineGrad.addColorStop(1, 'rgba(58, 121, 227, 0)')

        ctx.fillStyle = lineGrad
        ctx.fillRect(0, centerY - 1, W, 2 * breathe)
        ctx.shadowBlur = 0
        return
      }

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      const totalBarsWidth = W * 0.85
      const startX = (W - totalBarsWidth) / 2
      const barWidth = (totalBarsWidth - (NUM_BARS - 1) * BAR_GAP) / NUM_BARS
      const maxBarHeight = H * 0.45

      for (let i = 0; i < NUM_BARS; i++) {
        const binIndex = Math.floor((i / NUM_BARS) * bufferLength * 0.7)
        const rawValue = dataArray[binIndex] / 255
        const sensitivity = visualizerSensitivity ?? 2.0
        const amplitude = Math.min(rawValue * sensitivity, 1)

        const barHeight = Math.max(amplitude * maxBarHeight, 2)

        const x = startX + i * (barWidth + BAR_GAP)
        const y = centerY - barHeight

        ctx.shadowColor = '#3A79E3'
        ctx.shadowBlur = amplitude > 0.5 ? 18 : 8

        ctx.fillStyle = getBarColor(ctx, x, barHeight, H, amplitude)
        ctx.fillRect(x, y, barWidth, barHeight)
      }

      ctx.shadowBlur = 0

      ctx.fillStyle = 'rgba(58, 121, 227, 0.3)'
      ctx.fillRect(startX, centerY - 1, totalBarsWidth, 1)
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', setSize)
    }
  }, [currentBeatId, visualizerSensitivity])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block', zIndex: 0 }}
    />
  )
}
