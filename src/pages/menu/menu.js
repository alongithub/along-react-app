import React, {useState} from 'react';
import {
    Menu, Layout, Icon, Modal, Button,
} from 'antd';
import { Link } from 'react-router-dom';
import FreeScrollBar from 'react-free-scrollbar';
import logo from '@images/logo.jpg';
import './style.less';

const {
    Header, Content, Sider,
} = Layout;

const { SubMenu } = Menu;

const Menus = ({ children, location }) => {
    const [menuList] = useState([{
        title: '导航1',
        url: '/along/configuration',
        id: '/along/configuration2',
        icon: 'setting',
        // image: detail,
        children: [
            {
                title: '导航1-1',
                url: '/along/orgcode',
                id: '/along/orgcode',
            },
            {
                title: '导航1-2',
                url: '/along/pickup',
                id: '/along/pickup',
            },
        ],
    },
    {
        title: '导航2',
        url: '/along/mession',
        id: '/along/mession',
        // image: detail,
        icon: 'database',
        children: [
            {
                title: '导航2-1',
                url: '/along/mession',
                id: '/along/mession',
            },
            {
                title: '导航2-2',
                url: '/along/scene',
                id: '/along/scene',
            },
            {
                title: '导航2-3',
                url: '/along/alongpoint',
                id: '/along/alongpoint3',
            },
        ],
    },
    {
        title: '导航3',
        url: '/along/status',
        id: '/along/status',
        // image: detail,
        icon: 'tool',
        children: [
            {
                title: '导航3-1',
                url: '/along/allocation',
                id: '/along/allocation',
            },
            {
                title: '导航3-2',
                url: '/along/osdset',
                id: '/along/osdset',
            },
            {
                title: '导航3-3',
                url: '/along/status',
                id: '/along/status',
            },
            {
                title: '导航3-4',
                url: '/along/log',
                id: '/along/log',
            },
            {
                title: '导航3-5',
                url: '/along/ntp',
                id: '/along/ntp',
            },
            {
                title: '导航3-6',
                url: '/along/data',
                id: '/along/data',
            },
            {
                title: '导航3-7',
                url: '/along/update',
                id: '/along/update',
            },
            {
                title: '导航3-8',
                url: '/along/backup',
                id: '/along/backup',
            },
        ],
    },
    {
        title: '导航4',
        url: '/along/user',
        id: '/along/user',
        icon: 'team',
    },
    {
        title: '导航5',
        url: '',
        id: 'aboutus',
        icon: 'user',
    },
    ]);
    const { pathname } = location;
    const [openKeys, setOpenKeys] = useState([pathname]);
    const [collapsed, setCollapsed] = useState(false);

    const onOpenChange = (openkey) => {
        const lastopen = openKeys.length > 0 ? openKeys[0] : '';
        if (!lastopen) {
            setOpenKeys(openkey);
        } else if (openkey.length === 2) {
            setOpenKeys([openkey[1]]);
        } else {
            setOpenKeys([]);
        }
    };

    const onCollapse = (bool) => {
        setCollapsed(bool);
    };

    const createMenu = (arr) => {
        const list = [];
        arr.forEach((d) => {
            if (d.children !== undefined) {
                list.push(
                    <SubMenu
                        key={d.id}
                        title={(
                            <span>
                                {d.image ? <img src={d.image} alt="" /> : ''}
                                {d.icon ? <Icon type={d.icon} /> : ''}
                                <span className="titleSpan">{d.title}</span>
                            </span>
                        )}
                    >
                        {createMenu(d.children)}
                    </SubMenu>,
                );
            } else {
                list.push(
                    <Menu.Item key={d.id}>
                        <Link to={d.url ? d.url : '/'}>
                            {d.image ? <img src={d.image} alt="" className="icon" /> : ''}
                            {d.icon ? <Icon type={d.icon} /> : ''}
                            <span className="titleSpan">{d.title}</span>
                        </Link>
                    </Menu.Item>,
                );
            }
        });
        return list;
    };


    return (
        <Layout
            style={{ minHeight: '100vh' }}
            hasSider
            className="menu_"
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
            >
                <div className="sidermenu_wrapper" style={{ height: '100%', position: 'relative', paddingTop: '50px' }}>
                    <div className="menu_logo">
                        <img src={logo} alt="" />
                        {/* <footer */}
                        {/* style={{display: 'inline-block', marginRight: '20px'}} */}
                        {/* dangerouslySetInnerHTML={{ __html: typeof GLOBAL_CONFIG !== 'undefined' ? GLOBAL_CONFIG.logo : ''}} */}
                        {/* /> */}
                        <span>Along</span>
                    </div>
                    <FreeScrollBar autohide>
                        <Menu theme="dark" mode="inline" selectedKeys={[pathname]} openKeys={openKeys} onOpenChange={onOpenChange}>
                            {createMenu(menuList)}
                        </Menu>
                    </FreeScrollBar>
                </div>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0, position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '0', top: 0 }}>
                        <ul className="userOperate">
                            <li>
                                <Button
                                    icon="logout"
                                    style={{ border: 'none', padding: '0 5px' }}
                                    onClick={() => {
                                        Modal.confirm({
                                            title: '确认退出吗',
                                            onOk: () => {
                                                window.location.href = '/login';
                                            },
                                            okText: '确认',
                                            cancelText: '取消',
                                        });
                                    }}
                                />
                            </li>
                            <li>
                                hello along
                            </li>
                        </ul>
                    </div>
                    <p
                        style={{
                            textAlign: 'left',
                            fontSize: '15px',
                            fontWeight: '600',
                            padding: '0 20px',
                        }}
                    >
                        {/* {typeof GLOBAL_CONFIG !== 'undefined' ? GLOBAL_CONFIG.missionName : '2019年普通高等学校招生全国统一考试'} */}
                        along-react-app
                    </p>
                </Header>
                <Content style={{ margin: '8px', height: '80vh' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default Menus;
