import { useUser } from '../context/useUser';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function UserSelector() {
  const { users, selectedUserId, setSelectedUserId } = useUser();

  const items = users.map((user) => ({ label: user.email, value: user.id }));

  return (
    <Select
      items={items}
      value={selectedUserId ?? ''}
      onValueChange={(value) => {
        if (value) setSelectedUserId(value);
      }}
    >
      <SelectTrigger className="w-50">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.email}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}