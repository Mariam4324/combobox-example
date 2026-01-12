import { useComboBoxState, Item } from "react-stately";
import {
  useComboBox,
  useFilter,
  usePopover,
  type AriaComboBoxProps,
} from "react-aria";
import { useRef } from "react";

type Option = {
  id: number;
  name: string;
};

function ComboBox(props: AriaComboBoxProps<Option>) {
  const { contains } = useFilter({ sensitivity: "base" });
  const state = useComboBoxState({
    ...props,
    defaultFilter: contains,
  });

  const inputRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);

  const { inputProps, listBoxProps, labelProps, buttonProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      buttonRef,
      popoverRef,
    },
    state
  );

  const { popoverProps } = usePopover(
    {
      popoverRef,
      triggerRef: inputRef,
      // Try both values to see the issue:
      isNonModal: true, // popover closes on scroll and keyboard opening
      // isNonModal: false, // Input becomes non-editable
      offset: 8,
    },
    state
  );

  return (
    <div style={{ padding: "20px" }}>
      <label {...labelProps}>{props.label}</label>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          {...inputProps}
          ref={inputRef}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "200px",
          }}
        />
        <button {...buttonProps} ref={buttonRef}>
          ▼
        </button>
      </div>
      {state.isOpen && (
        <div
          {...popoverProps}
          ref={popoverRef}
          style={{
            marginTop: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            background: "white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            maxHeight: "200px",
            overflow: "auto",
          }}
        >
          <ul
            {...(listBoxProps as React.HTMLAttributes<HTMLUListElement>)}
            ref={listBoxRef}
          >
            {[...state.collection].map((item) => (
              <li key={item.key}>{item.rendered}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <div style={{ padding: "10px 20px", height: "200vh" }}>
      <ComboBox
        label="Label"
        defaultItems={[
          { id: 1, name: "Option 1" },
          { id: 2, name: "Option 2" },
          { id: 3, name: "Option 3" },
          { id: 4, name: "Option 4" },
          { id: 5, name: "Option 5" },
        ]}
      >
        {(item: Option) => (
          <Item key={item.id} textValue={item.name}>
            {item.name}
          </Item>
        )}
      </ComboBox>
    </div>
  );
}
