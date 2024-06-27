export function Stats() {
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow">
      <div className="stat">
        <div className="stat-figure text-secondary">
            <svg
                fill="none"
                stroke="#ab51e3"
                viewBox="0 0 16 16"
                height="2em"
                width="2em"
            >
                <path
                    fillRule="evenodd"
                    d="M1 8a7 7 0 1014 0A7 7 0 001 8zm15 0A8 8 0 110 8a8 8 0 0116 0zM4.5 7.5a.5.5 0 000 1h5.793l-2.147 2.146a.5.5 0 00.708.708l3-3a.5.5 0 000-.708l-3-3a.5.5 0 10-.708.708L10.293 7.5H4.5z"
                />
            </svg>
        </div>
        <div className="stat-title">Avg Cycle Length</div>
        <div className="stat-value">28 Days</div>
        <div className="stat-desc">Average duration</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg
              fill="none"
              stroke="#ab51e3"
              viewBox="0 0 16 16"
              height="2em"
              width="2em"
          >
            <path
                fillRule="evenodd"
                d="M4 .5a.5.5 0 00-1 0V1H2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V3a2 2 0 00-2-2h-1V.5a.5.5 0 00-1 0V1H4V.5zM1 14V4h14v10a1 1 0 01-1 1H2a1 1 0 01-1-1zm7-6.507c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132z"
            />
          </svg>
        </div>
        <div className="stat-title">Next Cycle Start</div>
        <div className="stat-value">5 July 2024</div>
        <div className="stat-desc">Predicted start date</div>
      </div>

      <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
                fill="none"
                stroke="#ab51e3"
                viewBox="0 0 16 16"
                height="2em"
                width="2em"
            >
              <path
                  fillRule="evenodd"
                  d="M1 8a7 7 0 1014 0A7 7 0 001 8zm15 0A8 8 0 110 8a8 8 0 0116 0zm-4.5-.5a.5.5 0 010 1H5.707l2.147 2.146a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 11.708.708L5.707 7.5H11.5z"
              />
            </svg>
          </div>
          <div className="stat-title">Last Period Start</div>
          <div className="stat-value">7 June 2024</div>
          <div className="stat-desc">Date of last period</div>
      </div>
    </div>
  )
}

export function StatsPage() {
  return (
    <div className = "stats-section flex flex-col justify-center">
      <h3
        className="text-2xl font-bold tracking-tighter sm:text-2xl xl:text-3xl/none text-[#000080]">
        Your Insights
      </h3>
      <Stats />
    </div>
  )
}
