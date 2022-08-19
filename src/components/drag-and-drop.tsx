import React, { ReactNode } from 'react'
import { Draggable, DraggableProps, Droppable, DroppableProps, DroppableProvided, DroppableProvidedProps } from 'react-beautiful-dnd'

//把DroppableProps原来的children删掉，并添加进去一个ReactNode作为children
type DropProps = Omit<DroppableProps, 'children'> & {children: ReactNode}

export default function Drop({children, ...props}: DropProps) {
  return (
    <Droppable {...props}>
      {
        (provided => {
          if(React.isValidElement(children)){
            return React.cloneElement(children, {
              ...provided.droppableProps,
              ref: provided.innerRef,
              provided
            })
          }
          return <div/>
        })
      }
    </Droppable>
  )
}

//使用React.forwardRef()后就可以给组件传入useRef中的ref
type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvidedProps
> & React.HTMLAttributes<HTMLDivElement>;
export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
      {props.provided?.placeholder}
    </div>
  )
);

type DragProps = Omit<DraggableProps, "children"> & { children: ReactNode };
export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <Draggable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ref: provided.innerRef,
          });
        }
        return <div />;
      }}
    </Draggable>
  );
};

