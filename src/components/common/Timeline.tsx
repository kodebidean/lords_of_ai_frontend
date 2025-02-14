import React from 'react';

interface ItemProps {
    date: string;
    title: string;
    children: React.ReactNode;
    isMajor?: boolean;
}

const TimelineItem: React.FC<ItemProps> = ({ 
    date, 
    title, 
    children, 
    isMajor = false 
}) => {
    return (
        <div className="relative pl-8 pb-8">
            <div className="absolute left-0 top-0 mt-1.5">
                <div className={`
                    w-3 h-3 rounded-full border-2
                    ${isMajor 
                        ? 'border-got-tech bg-white dark:bg-got-dark-bg' 
                        : 'border-gray-300 bg-gray-100 dark:bg-got-dark-bg/50'}
                `} />
            </div>
            <div className="border-l-2 border-gray-200 dark:border-gray-700 absolute left-1.5 top-3 h-full" />
            
            <div className="text-xs text-got-light-text dark:text-got-dark-text mb-1">
                {date}
            </div>
            <h4 className="text-sm font-medium mb-2">{title}</h4>
            <div>{children}</div>
        </div>
    );
};

interface TimelineProps {
    children: React.ReactNode;
}

export const Timeline: React.FC<TimelineProps> & {
    Item: typeof TimelineItem;
} = ({ children }) => {
    return (
        <div className="relative">
            {children}
        </div>
    );
};

Timeline.Item = TimelineItem; 