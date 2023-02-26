type Point = [number, number]

const getPointsOnLine = (A: Point, B: Point, N: number) => {
  const points: Point[] = [A]

  // Calculate the slope and y-intercept of the line
  const slope = (B[1] - A[1]) / (B[0] - A[0])
  const yIntercept = A[1] - slope * A[0]

  // Calculate the increment for x and y values
  const deltaX = (B[0] - A[0]) / (N - 1)

  // Generate N points on the line using the calculated slope and y-intercept
  for (let i = 0; i < N; i++) {
    const x = A[0] + i * deltaX
    const y = slope * x + yIntercept

    points.push([x, y])
  }

  points.push(B)

  return points
}

const ROUTE_POINTS: Point[] = [
  [-12.023379802458264, -77.05025254520329],
  [-12.027981743304263, -77.05700122552557],
  [-12.028191565177314, -77.05751536331009],
  [-12.028094983940733, -77.05795492670691],
  [-12.028430784537324, -77.05842696894668],
  [-12.028951326726146, -77.05832905616164],
  [-12.029040492133484, -77.05781411606263],
  [-12.02867061204168, -77.05747882407664],
  [-12.028085599159645, -77.05686457433212],
  [-12.023461585842, -77.05018732332793]
]

export { getPointsOnLine, ROUTE_POINTS }
export type { Point }
