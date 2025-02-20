import "./App.css";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { ConfigProvider, theme } from "antd";
import Helper from "@/utils/helper";

import MessageContextProvider from "@/contexts/message_context";
import NotificationContextProvider from "./contexts/notification_context";
import ModalContextProvider from "./contexts/modal_context";

import Landing from "@/pages/landing/landing";
import MainMenu from "@/pages/main_menu/main_menu";

import Index from "@/pages/landing/subpages/index";
import Home from "@/pages/landing/subpages/home/home";
import About from "@/pages/landing/subpages/about/about";
import Login from "@/pages/landing/subpages/login/login";
import Register from "@/pages/landing/subpages/register/register";

import Dashboard from "@/pages/main_menu/subpages/dashboard/dashboard";
import FinancialTargets from "@/pages/main_menu/subpages/financial_targets/financial_targets";
import Transactions from "@/pages/main_menu/subpages/transactions/transactions";
import Reports from "@/pages/main_menu/subpages/reports/reports";
import AccountSettings from "@/pages/main_menu/subpages/account_settings/account_settings";
import Settings from "@/pages/main_menu/subpages/settings/settings";


const queryClient = new QueryClient();

export default function App() {
    const appLocation = useLocation();
    const navigate = useNavigate();
    
    useEffect(function () {
        const path = Helper.getFromSessionStorage("current_path");
        navigate(path);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(function () {
        const path = appLocation.pathname;
        const loginStatus = JSON.parse(Helper.getSavedLoginStatus());
        if(path?.includes("main") && (loginStatus === null || loginStatus === false)) {
            navigate("/login", { replace: true });
            return function () {};
        }
        Helper.saveToSessionStorage("current_path", path);
        console.log({path});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appLocation]);

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                    theme={{
                        algorithm: [theme.compactAlgorithm],
                        token: {
                            colorPrimary: "#154495",
                            borderRadius: 0,
                        },
                        components: {
                            Menu: {
                                itemSelectedBg: "#3261B2",
                                itemSelectedColor: "#FFFFFF",
                            },
                        },
                    }}>
                        
                <MessageContextProvider>
                <NotificationContextProvider>
                <ModalContextProvider>
                    <Routes>
                        <Route path="/" element={<Landing/>}>
                            <Route index={true} element={<Index/>}/>
                            <Route path="home" element={<Home/>}/>
                            <Route path="about" element={<About/>}/>
                            <Route path="login" element={<Login/>}/>
                            <Route path="register" element={<Register/>}/>
                        </Route>
                        <Route path="main" element={<MainMenu/>}>
                            <Route path="dashboard" element={<Dashboard/>}/>
                            <Route path="financial_targets" element={<FinancialTargets/>}/>
                            <Route path="transactions" element={<Transactions/>}/>
                            <Route path="reports" element={<Reports/>}/>

                            <Route path="account_settings" element={<AccountSettings/>}/>
                            <Route path="settings" element={<Settings/>}/>
                        </Route>
                    </Routes>
                </ModalContextProvider>
                </NotificationContextProvider>
                </MessageContextProvider>
            </ConfigProvider>
        </QueryClientProvider>
    );
}

