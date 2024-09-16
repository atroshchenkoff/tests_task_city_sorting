import { FC, HTMLAttributes, PropsWithChildren, useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Form, Input, Popconfirm, Table, Typography, DatePicker, Button } from 'antd';
import './style.sass'
import { City, SendToCitiesMachineType } from '../../machines/citiesMachine';
import dayjs from 'dayjs';

interface EditableCellProps extends HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'date' | 'text';
  record: City;
  index: number;
}

const EditableCell: FC<PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'date'
    ? <DatePicker format={'DD-MM-YYYY'} />
    : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Поле ${title} обязательно!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const CityTable: FC<{
  cities: City[],
  sendToCitiesMachine: SendToCitiesMachineType
}> = ({
  cities,
  sendToCitiesMachine
}) => {
    const [form] = Form.useForm();
    const [data, setData] = useState(cities);
    const [editingKey, setEditingKey] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [creatingMode, setCreatingMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      setData(cities);
    }, [cities]);

    const isEditing = (record: City) => record._id === editingKey;

    const edit = (record: City) => {
      form.setFieldsValue({ ...record, foundationDate: dayjs(record.foundationDate) });
      setEditingKey(record._id!);
      setDisabled(true)
    };

    const cancelEditing = () => {
      setEditingKey('');
      setDisabled(false)
    };

    const cancelAdding = () => {
      setData(data.slice(0, -1));
      setEditingKey('');
      setDisabled(false)
      setCreatingMode(false)
    };

    const save = async (recordId: string) => {
      try {
        const row = (await form.validateFields()) as City;

        const newData = [...data];
        const index = newData.findIndex((item) => recordId === item._id);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setData(newData);
          setEditingKey('');
          setDisabled(false)
          setCreatingMode(false)

          sendToCitiesMachine(creatingMode ? {
            type: 'ADD',
            city: { ...row }
          } : {
            type: 'UPDATE',
            city: { ...row, _id: recordId }
          });
        } else {
          newData.push(row);
          setData(newData);
          setEditingKey('');
        }
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };

    const handleAdd = () => {
      const lastPage = Math.ceil((data.length + 1) / 10);
      setCurrentPage(lastPage);

      const newData: City = {
        _id: 'newRow',
        name: '',
        foundationDate: new Date(),
      };

      setData([...data, newData]);
      edit(newData);
      setCreatingMode(true);
    };

    const columns = [
      {
        title: 'Город',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'Дата основания',
        dataIndex: 'foundationDate',
        width: '40%',
        editable: true,
        render: (foundationDate: Date) => dayjs(foundationDate).format('DD-MM-YYYY'),
      },
      {
        title: 'Действия',
        dataIndex: '_id',
        render: (_: City['_id'], record: City) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link onClick={() => save(record._id)} style={{ marginInlineEnd: 8 }}>
                {creatingMode ? 'Добавить' : 'Сохранить'}
              </Typography.Link>
              <Popconfirm title="Отменить?" onConfirm={creatingMode ? cancelAdding : cancelEditing} okText="Да" cancelText="Нет">
                <a>Отменить</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <Typography.Link
                disabled={editingKey !== ''}
                onClick={() => edit(record)}
                style={{ marginInlineEnd: 8 }}
              >
                Редактировать
              </Typography.Link>
              <Popconfirm
                disabled={editingKey !== ''}
                title="Вы действительно хотите удалить?"
                onConfirm={() => sendToCitiesMachine({ type: 'DELETE', id: record._id })}
                okText="Да"
                cancelText="Нет"
                style={{ marginInlineEnd: 8 }}
              >
                <Typography.Link disabled={editingKey !== ''}>Удалить</Typography.Link>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const mergedColumns: TableProps<City>['columns'] = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: City) => ({
          record,
          inputType: col.dataIndex === 'foundationDate' ? 'date' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });

    return (
      <>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }} disabled={disabled}>
          Добавить
        </Button>

        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              current: currentPage,
              onChange: (page) => {
                setCurrentPage(page);
                return creatingMode
                  ? cancelAdding()
                  : cancelEditing()
              },
            }}
            rowKey={(record) => record._id}
          />
        </Form>
      </>
    );
  };

export default CityTable;
