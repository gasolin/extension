import React, { ReactElement } from "react"

interface Props {
  setPanelNumber: (x: number) => void
  panelNumber: number
  panelNames: string[]
}

export default function SharedPanelSwitcher(props: Props): ReactElement {
  const { setPanelNumber, panelNumber, panelNames } = props

  // TODO: make these styles work for more than two panels
  // .selected::after is the hardcoded culprit.
  return (
    <nav>
      <ul>
        {panelNames.slice(0, 3).map((name, index) => {
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => {
                  setPanelNumber(index)
                }}
                className={`option${panelNumber === index ? " selected" : ""}`}
              >
                {name}
              </button>
            </li>
          )
        })}
      </ul>
      <style jsx>
        {`
          nav {
            width: 100%;
            position: relative;
            display: block;
            height: 31px;
            border-bottom: 1px solid
              var(--panel-switcher-border, var(--green-120));
          }
          button {
            color: var(--green-40);
          }
          ul {
            display: flex;
            padding-left: 24px;
            padding-bottom: 12px;
          }
          .option {
            margin-right: 16px;
            cursor: pointer;
          }
          .option:hover {
            color: var(--gold-40);
          }
          .selected {
            font-weight: 500;
            color: var(--trophy-gold);
            text-align: center;
            display: flex;
            justify-content: center;
          }
          .selected:hover {
            color: var(--trophy-gold);
          }
          .selected::after {
            content: "";
            width: 18px;
            height: 2px;
            background-color: var(--trophy-gold);
            border-radius: 10px;
            position: absolute;
            display: block;
            margin-top: 29px;
          }
        `}
      </style>
    </nav>
  )
}
