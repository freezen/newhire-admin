import React, { PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCredentials } from '../../../../utils/login';
import { post } from '../../../../utils/request';
import './item.scss';

export interface IVideoItem {
    id: number;
    uname: string;
    upic?: string;
    name: string;
    url: string;
    likes: boolean;
    pic: string;
}

type Props = PropsWithChildren<{
    data: IVideoItem;
    getList: (isRefresh?: boolean, sort?: boolean) => void;
    style?: any;
}>;

const styles = {
    picture: {
        height: '200px',
        width: '100%',
        overflow: 'hidden',
    },
    title: {
        padding: '5px',
        fontFamily: 'Ping Fang SC, SimHei',
        fontSize: '16px',
    },
    bottom: {
        paddingLeft: '5px',
        paddingRight: '5px',
        display: 'flex',
    },
    left: {
        flex: 1,
        alignItems: 'center',
        display: 'flex',
    },
    uHead: {
        borderRadius: '12px',
    },
    uname: {
        marginLeft: '5px',
        fontSize: '14px'
    },
};

export const Item: React.FC<Props> = ({style, data, getList}) => {
    let navigator = useNavigate();
    const [loaded, setLoaded] = useState(false);

    const clickItem = () => {
        navigator('/detail');
    };
    const delItem = async () => {
        await post(
            '/video/delete',
            {
                id: data.id,
            }
        );
        getList(true)
    };
    const loadPic = () => {
        setLoaded(true);
    };
    
    return (
        <div className='container' style={{...style}} onTouchEnd={clickItem}>
            <img style={styles.picture} alt="" src={data.pic} onLoad={loadPic}/>
            {loaded === false && <div className='loading'/>}
            <div style={styles.title}>
                {data.name}
            </div>
            <div style={styles.bottom}>
                <span style={styles.left}>
                    <img
                        alt=""
                        src={`../../../../assets/${data.uname}.png`}
                        style={{borderRadius: '50%'}}
                    />
                    <span style={styles.uname}>{data.uname}</span>
                </span>
                <img
                    alt=""
                    src={'../../../../assets/loved.png'}
                />
                <span style={{marginLeft: '5px'}}>{data.likes ?? 0}</span>
            </div>
            {
                getCredentials().token && (
                    <img className='delBtn' onClick={delItem} alt="" src='../../../../assets/delete.png' />
                )
            }
        </div>
    )
}