import React, { useEffect, useState } from 'react';
import { getCredentials } from '../../../../utils/login';
import { get } from '../../../../utils/request';
import { Item, IVideoItem } from '../item/Item';
import './list.scss';

export const List = () => {
    const [pageNo, setPageNo] = useState(0);
    const [list, setList] = useState<IVideoItem[]>([]);

    async function getList(isRefresh = false, sort = false) {
        try {
            let pageNum = pageNo;
            if (isRefresh) {
            pageNum = 0;
            }
            console.log('getList, pageNo=', pageNum);

            const res = await get(
                `/getVideoList?pageNo=${pageNum}&sort=${sort ? 1 : 0}&platform=web&pageSize=12&userid=${
                    getCredentials().id
                }`,
            );
            console.log('len:', res.data.length);
            const data = res.data;
            if (isRefresh) {
                // handle refresh mode, show the 1st page
                setList(data);
                setPageNo(1);
            } else if (data && data.length > 0) {
                // handle loadmore mode, concat the next page
                setList([...list, ...data]);
                setPageNo(pageNum + 1);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log('mount');
        getList(true);
    }, []);

    function debounce(fn: Function, timeout = 300) {
        let timer: NodeJS.Timeout; // 声明计时器
        return function () {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn();
            }, timeout);
        };
    }
    const loadMore = debounce(() => {
        getList()
    })

    const scroll = (e: React.ChangeEvent<any>) => {
        if(document.body.clientHeight - e.target?.clientHeight - e.target?.scrollTop < 100) {
            loadMore()
        }
    }

    const changeCheck = (e: React.ChangeEvent<any>) => {
        if(e.target.checked){
            getList(true, true)
        } else {
            getList(true)
        }
    }

    if (!list.length) {
        return null;
    }
        
    return (
        <div className='listContainer' onScroll={scroll}>
            <div className='sortBar'>
                <input type="checkbox" onChange={changeCheck} />
                <span>Sort by likes</span>
            </div>
            {
                list.map(item => {
                    return (
                        <Item
                            key={item.id}
                            data={item}
                            getList={getList}
                        />
                    )
                })
            }
        </div>
    )
}