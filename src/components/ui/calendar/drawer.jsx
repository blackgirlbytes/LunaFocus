import {  Radio  } from "antd";

const Drawer = ({showDrawer, updateShowDrawer}) => {
  const onClose = () => {
    updateShowDrawer(false);
  };
  const placement = "bottom";

  return (
    <Radio
        title="Basic Drawer"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={showDrawer}
        key={placement}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Radio>
  );
};

export default Drawer;