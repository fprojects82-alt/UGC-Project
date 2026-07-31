'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { sendMessage } from '@/app/[locale]/dashboard/actions';

export interface MessageVM {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
}

export function MessageThread({
  orderId,
  messages,
  currentUserId
}: {
  orderId: string;
  messages: MessageVM[];
  currentUserId: string | null;
}) {
  const t = useTranslations('dashboard.order');
  const tEmpty = useTranslations('dashboard.empty');
  const [pending, start] = useTransition();
  const [value, setValue] = useState('');
  const [list, setList] = useState(messages);

  function submit() {
    if (!value.trim()) return;
    const body = value;
    setValue('');
    start(async () => {
      const r = await sendMessage(orderId, body);
      if (!r.error) {
        setList((prev) => [
          ...prev,
          { id: crypto.randomUUID(), body, sender_id: currentUserId ?? 'me', created_at: new Date().toISOString() }
        ]);
      }
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex-1 space-y-2 overflow-y-auto">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tEmpty('messages')}</p>
        ) : (
          list.map((m) => {
            const mine = m.sender_id === currentUserId;
            return (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  mine ? 'ms-auto bg-primary text-primary-foreground' : 'bg-card'
                }`}
              >
                {m.body}
              </div>
            );
          })
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={t('sendPlaceholder')}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <Button size="sm" onClick={submit} disabled={pending || !value.trim()}>
          {t('send')}
        </Button>
      </div>
    </div>
  );
}
