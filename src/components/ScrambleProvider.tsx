import React, { ReactNode, ReactElement } from "react"
import { ScrambleText } from "./ScrambleText"

const SKIP_TAGS = [
  "input",
  "textarea",
  "button",
  "select",
  "option",
  "script",
  "style"
]

function scrambleChildren(children: ReactNode): ReactNode {
  return React.Children.map(children, (child, index) => {
    // 1️⃣ Plain text
    if (typeof child === "string") {
      if (!child.trim()) return child

      return (
        <ScrambleText
          key={`scramble-${index}`}
          text={child}
        />
      )
    }

    // 2️⃣ Only process valid React elements
    if (React.isValidElement(child)) {
      const element = child as ReactElement<{ children?: ReactNode }>

      // Skip certain DOM tags
      if (
        typeof element.type === "string" &&
        SKIP_TAGS.includes(element.type)
      ) {
        return element
      }

      // If it has children, recursively process them
      if (element.props?.children) {
        return React.cloneElement(element, {
          children: scrambleChildren(element.props.children),
        })
      }

      return element
    }

    return child
  })
}

export function ScrambleProvider({
  children,
}: {
  children: ReactNode
}) {
  return <>{scrambleChildren(children)}</>
}