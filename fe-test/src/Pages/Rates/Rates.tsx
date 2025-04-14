import { useEffect, useState } from 'react';
import DropDown from '../../Components/DropDown';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';
import TextInput from '../../Components/TextInput/TextInput';

let countries = CountryData.CountryCodes;

type ConvertAmount = {
    amountWithoutMarkup: number,
    amountWithMarkup: number
}

const calculateConvertAmount = (amount:number, rate:number)=>{
    const amountWithoutMarkup = amount*rate;
    const amountWithMarkup = amountWithoutMarkup - 0.005*rate*amount
    return  {
        amountWithoutMarkup,
        amountWithMarkup
    }
   
}

const Rates = () => {
    const [fromCurrency, setFromCurrency] = useState('AU');
    const [toCurrency, setToCurrency] = useState('US');
    const [amount, setAmount] = useState(0);
    const [convertAmount, setConvertAmount] = useState({
        amountWithoutMarkup:0,
        amountWithMarkup:0
    })

    const [exchangeRate, setExchangeRate] = useState(0.7456);
    const [progression, setProgression] = useState(0);
    const [loading, setLoading] = useState(false);

    const Flag = ({ code }: { code: string }) => (
        <img alt={code || ''} src={`/img/flags/${code || ''}.svg`} width="20px" className={classes.flag} />
    );

    const fetchData = async () => {
        if (!loading) {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            setLoading(false);
        }
    };

    // Demo progress bar moving :)
    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                fetchData();
                return 0;
            }
            return (prevState + deltaTime * 0.0001) % 1;
        });
    });

    const handleAmountOnchange = (inputAmount:string)=>{
        if (!Number.isNaN(inputAmount)) 
        {
            setAmount(Number(inputAmount));
        } else {
            setAmount(0)
        }       
        
    }

    useEffect(() => {
        setConvertAmount(calculateConvertAmount(Number(amount),exchangeRate));
        
     }, [amount]);

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <div className={classes.heading}>Currency Conversion</div>

                <div className={classes.rowWrapper}>
                    <div>
                        <DropDown
                            id='fromCurrency'
                            leftIcon={<Flag code={fromCurrency} />}
                            label={'From'}
                            selected={countryToCurrency[fromCurrency as keyof typeof countryToCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryToCurrency[code as keyof typeof countryToCurrency],
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={(key: string) => {
                                setFromCurrency(key);
                            }}
                            style={{ marginRight: '20px' }}
                        />
                    </div>

                    <div className={classes.exchangeWrapper}>
                        <div className={classes.transferIcon}>
                            <img src="/img/icons/Transfer.svg" alt="Transfer icon" />
                        </div>

                        <div className={classes.rate} id="exchangeRate">{exchangeRate}</div>
                    </div>

                    <div>
                        <DropDown
                            id='toCurrency'
                            leftIcon={<Flag code={toCurrency} />}
                            label={'To'}
                            selected={countryToCurrency[toCurrency as keyof typeof countryToCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryToCurrency[code as keyof typeof countryToCurrency],
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={(key: string) => {
                                setToCurrency(key);
                            }}
                            style={{ marginLeft: '20px' }}
                        />
                    </div>
                </div>
                <div></div>

                <div className={classes.rowWrapper}>
                    <div><TextInput label='Amount' id="amount" onChange={handleAmountOnchange}></TextInput></div>
                    <div><TextInput label='Convert amount without markup' id="convertAmount" value={convertAmount?.amountWithoutMarkup} readonly></TextInput></div>
                    <div><TextInput label='Convert amount with markup' id="convertAmountWithMarkup" value={convertAmount?.amountWithMarkup} readonly></TextInput></div>
                </div>

                <ProgressBar
                    progress={progression}
                    animationClass={loading ? classes.slow : ''}
                    style={{ marginTop: '20px' }}
                />

                {loading && (
                    <div className={classes.loaderWrapper}>
                        <Loader width={'25px'} height={'25px'} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rates;
