import { useEffect, useState } from 'react';
import { Button, ColorPicker, Form, Input, Modal, Select, Table, SelectProps, Typography, Popconfirm } from 'antd';
import { NamedList, SendToNamedListsMachineType } from '../../machines/namedListMachine';

export const NamedListTable: React.FC<{
  isLoadingNamedList: boolean,
  isRemovingNamedList: boolean,
  namedLists: NamedList[],
  formattedCities: SelectProps['options'],
  sendToNamedListsMachine: SendToNamedListsMachineType,
}> = ({
  isLoadingNamedList,
  isRemovingNamedList,
  namedLists,
  formattedCities,
  sendToNamedListsMachine
}) => {
    const [data, setData] = useState(namedLists);
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [editableRow, setEditableRow] = useState<NamedList | null>(null);

    const onCreate = (values) => {
      const { name, shortName, color, cities } = values
      sendToNamedListsMachine(editableRow !== null ? {
        type: 'UPDATE',
        list: {
          ...editableRow,
          name,
          shortName,
          color: typeof color === 'string' ? color : color.toHexString(),
          cities
        }
      } : {
        type: 'CREATE',
        list: {
          name,
          shortName,
          color: typeof color === 'string' ? color : color.toHexString(),
          cities
        }
      })
      setOpen(false);
      setEditableRow(null);
    };

    useEffect(() => {
      setData(namedLists)
    }, [namedLists])

    useEffect(() => {
      if (open || editableRow !== null) {
        sendToNamedListsMachine({ type: 'FETCH_CITIES' })
        return
      }
    }, [open, editableRow])

    const columns = [
      {
        title: 'Ярлык',
        dataIndex: 'color',
        width: '80px',
        render: (color: NamedList['color']) => {
          return <ColorPicker value={color} disabled />;
        }
      },
      {
        title: 'Короткое название',
        dataIndex: 'shortName',
      },
      {
        title: 'Название',
        dataIndex: 'name',
      },
      {
        title: 'Действия',
        dataIndex: '_id',
        width: '200px',
        render: (id: NamedList['_id'], record: NamedList) => {
          return (
            <span>
              <Typography.Link
                onClick={() => setEditableRow(record)}
                style={{ marginInlineEnd: 8 }}
              >
                Редактировать
              </Typography.Link>
              <Popconfirm
                title="Вы действительно хотите удалить?"
                onConfirm={() => sendToNamedListsMachine({ type: 'DELETE', id })}
                okText="Да"
                cancelText="Нет"
                style={{ marginInlineEnd: 8 }}
              >
                <Typography.Link>
                  Удалить
                </Typography.Link>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <>
        <Button type="primary" style={{ marginBottom: 16 }} onClick={() => setOpen(true)}>
          Новый список
        </Button>

        <Modal
          open={open || editableRow !== null}
          title={editableRow !== null ? "Редактирование списка" : "Новый список"}
          okText={editableRow !== null ? "Изменить" : "Создать"}
          cancelText="Отмена"
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          onCancel={() => {
            setOpen(false)
            setEditableRow(null)
          }}
          destroyOnClose
          modalRender={(dom) => (
            <Form
              layout="vertical"
              form={form}
              name="form_in_modal"
              clearOnDestroy
              onFinish={(values) => onCreate(values)}
            >
              {dom}
            </Form>
          )}
          maskClosable={false}
        >
          <Form.Item
            name="name"
            label="Название"
            initialValue={editableRow !== null ? editableRow.name : ''}
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="shortName"
            label="Короткое название"
            initialValue={editableRow !== null ? editableRow.shortName : ''}
            rules={[{ required: true, message: 'Введите короткое название' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="color"
            label="Цвет ярлыка"
            initialValue={editableRow !== null ? editableRow.color : '#1890ff'}
            rules={[{ required: true, message: 'Выберите цвет' }]}
          >
            <ColorPicker format='hex' />
          </Form.Item>

          <Form.Item
            name="cities"
            label="Города"
            initialValue={editableRow !== null ? editableRow.cities.map((city) => city._id) : []}
            rules={[{ required: true, message: 'Добавьте города', type: 'array' }]}
          >
            <Select mode="multiple" options={formattedCities} />
          </Form.Item>
        </Modal>

        <Table
          bordered
          dataSource={data}
          columns={columns}
          rowClassName="editable-row"
          rowKey={(record) => record._id}
          pagination={false}
          loading={isLoadingNamedList || isRemovingNamedList}
        />
      </>
    )
  }
