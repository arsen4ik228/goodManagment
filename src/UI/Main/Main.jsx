import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './Main.module.css';
import menuIcon from './icon/icon _ menu.svg'
import { useGetOrganizationsQuery } from '../../BLL/organizationsApi';
const Main = () => {

    const navigate = useNavigate();
    const { userId } = useParams()
    const [selectedOrg, setSelectedOrg] = useState()


    const {
        organizations = []
    } = useGetOrganizationsQuery(userId, {
        selectFromResult: ({ data }) => ({
            organizations: data?.organizations || []
        })
    })

    const selectOrganization = (id) => {
        setSelectedOrg(id);
        if (typeof window !== 'undefined' && window.localStorage) {
            let savedId = window.localStorage.getItem('selectedOrganizationId');

            if (savedId && savedId === id.toString()) return

            window.localStorage.setItem('selectedOrganizationId', id.toString());
        }
    }

    const getStyles = useMemo(() => (id) => {
        if (id === selectedOrg) {
            return {
                'borderBottom': '1px solid #005475',
                'color': '#005475'
            };
        }
    }, [selectedOrg]);

    useEffect(() => {
        if (organizations.length > 0 && !selectedOrg)
            selectOrganization(organizations[0]?.id)

    }, [organizations])

    return (
        <div className={classes.wrapper}>
            <div className={classes.headContainer}>
                <div className={classes.headRow}>
                    <div className={classes.headElem}>
                        <div className={classes.headText}>КОНТАКТЫ</div>
                    </div>
                    <img src={menuIcon} alt="icon" />
                </div>
            </div>
            <div className={classes.body}>
                <div className={classes.bodyColumn}>
                    {organizations?.map((item, index) => (
                        <div
                            key={index}
                            className={classes.orgElement}
                            onClick={() => selectOrganization(item?.id)}
                            style={getStyles(item.id)}
                        >
                            <span className={classes.bodyElementText}>{item.organizationName}</span>
                        </div>
                    ))}
                </div>
            </div>
            <footer className={classes.inputContainer}>
                <div className={classes.inputRow}>
                    <div className={classes.inputElement}><input type="search" placeholder="Поиск" /></div>
                </div>
            </footer>
        </div>
    );
};

export default Main;