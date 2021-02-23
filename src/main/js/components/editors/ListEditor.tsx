import React from 'react';
import { Button, Input, Row, Col, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export type ListProps<T> = {
  name?: string;
  list: T;
  update: any;
};

export const ListEditor: React.FC<ListProps<any>> = ({ name, list, update }: ListProps<any>) => {
  const addItem = () => {
    Array.isArray(list) ? addItemAsList() : addItemAsDict();
  };
  const addItemAsList = () => {
    const newList = [...list, '='];
    update(newList);
  };
  const addItemAsDict = () => {
    const indexes = Object.keys(list || {})
      .filter((val) => val.startsWith('new'))
      .map((val) => parseInt(val.replace('new', '')));

    const index = Math.max(0, ...indexes) + 1;
    const newList = { ...list, ['new' + index]: 'value' };
    update(newList);
  };
  return (
    <>
      <Button style={{float: 'right'}} type="primary" shape="circle" icon={<PlusOutlined />} onClick={addItem} />
      <h2>{name} {Array.isArray(list) ? <Tag>array</Tag>:<Tag>dict</Tag>}</h2>
      {Array.isArray(list) ? asList(list, update) : asDict(list, update)}
    </>
  );
};

const asList = (list, update) => {
  const updateKey = (index) => (key) => {
    const newList = [];
    newList[index] = key + '=' + list[index].split('=')[1];
    update(newList);
  };
  const updateValue = (index) => (value) => {
    const newList = [];
    newList[index] = list[index].split('=')[0] + '=' + value;
    update(newList);
  };
  const remove = (index) => () => {
    const newList = [];
    newList[index] = list[index];
    update([], newList);
  };

  const eventAdapter = (fun) => {
    return (e) => fun(e.target.value);
  };

  return list.map((item, index) => (
    <Input.Group>
      <Row gutter={8}>
        <Col span={16}>
          <Input addonBefore="key" placeholder="key" value={item.split('=')[0]} onChange={eventAdapter(updateKey(index))} />
        </Col>
        <Col span={8}>
          <Input
            addonBefore="value"
            placeholder="value"
            value={item.split('=')[1] || ''}
            onChange={eventAdapter(updateValue(index))}
            addonAfter={<Button shape="circle" danger onClick={remove(index)} icon={<DeleteOutlined />} />}
          />
        </Col>
      </Row>
    </Input.Group>
  ));
};
const asDict = (list, update) => {
  const updateKey = (oldKey) => (newkey) => {
    update({[newkey]: list[oldKey]}, {[oldKey]: list[oldKey]});
  };
  const updateValue = (key) => (value) => {
    update({[key]: value});
  };
  const remove = (key) => () => {
    const newList = { ...list };
    update({}, {[key]: null});
  };
  const eventAdapter = (fun) => {
    return (e) => fun(e.target.value);
  };
  return (
    list &&
    Object.entries(list)
      .sort(([key1], [key2]) => key1.localeCompare(key2))
      .map(([key, itemValue]) => {
        return (
          <Input.Group>
            <Row gutter={8}>
              <Col span={16}>
                <Input placeholder="key" value={key} onChange={eventAdapter(updateKey(key))} />
              </Col>
              <Col span={8}>
                <Input
                  placeholder="value"
                  value={itemValue}
                  onChange={eventAdapter(updateValue(key))}
                  addonAfter={<Button shape="circle" danger onClick={remove(key)} icon={<DeleteOutlined />} />}
                />
              </Col>
            </Row>
          </Input.Group>
        );
      })
  );
};
