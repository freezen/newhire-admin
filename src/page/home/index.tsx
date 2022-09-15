import React, { useState } from 'react';
import { List } from './components/list/List';
import './index.scss';

export const Home = () => {
    return (
        <div className="homeContainer">
            <List/>
        </div>
    )
}