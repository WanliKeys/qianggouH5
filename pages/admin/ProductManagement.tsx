import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { Column } from '../../components/admin/DataTable';
import { api } from '../../api';
import { supabase } from '../../supabaseClient';
import { Edit, Trash2, Plus, Upload, Image as ImageIcon } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  subtitle: string;
  base_price: number;
  currentPrice: number;
  image: string;
  tags: string[];
  created_at: string;
}

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    basePrice: '',
    image: '',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const data = await api.adminGetProducts();
      setProducts(data.products);
    } catch (err: any) {
      setError(err.message || '加载失败');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 验证文件大小 (最大5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // 上传到Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // 获取公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 更新表单数据和预览
      setFormData({ ...formData, image: publicUrl });
      setImagePreview(publicUrl);
      setNotice('图片上传成功');
      setTimeout(() => setNotice(''), 2000);
    } catch (err: any) {
      setError(err.message || '图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    setNotice('');
    setError('');
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      await api.adminAddProduct({
        title: formData.title,
        subtitle: formData.subtitle,
        basePrice: Number(formData.basePrice),
        image: formData.image || 'https://picsum.photos/400/400',
        tags
      });
      setNotice('商品添加成功');
      setShowAddModal(false);
      setFormData({ title: '', subtitle: '', basePrice: '', image: '', tags: '' });
      fetchProducts();
    } catch (err: any) {
      setError(err.message || '添加失败');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    setNotice('');
    setError('');
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      await api.adminUpdateProduct({
        productId: editingProduct.id,
        title: formData.title,
        subtitle: formData.subtitle,
        basePrice: Number(formData.basePrice),
        image: formData.image,
        tags
      });
      setNotice('商品更新成功');
      setShowEditModal(false);
      setEditingProduct(null);
      setFormData({ title: '', subtitle: '', basePrice: '', image: '', tags: '' });
      fetchProducts();
    } catch (err: any) {
      setError(err.message || '更新失败');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('确定删除此商品吗?')) return;
    setNotice('');
    setError('');
    try {
      await api.adminDeleteProduct({ productId });
      setNotice('商品删除成功');
      fetchProducts();
    } catch (err: any) {
      setError(err.message || '删除失败');
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      subtitle: product.subtitle,
      basePrice: product.base_price.toString(),
      image: product.image,
      tags: product.tags.join(', ')
    });
    setImagePreview(product.image);
    setShowEditModal(true);
  };

  const productColumns: Column[] = [
    {
      key: 'id',
      label: '商品ID',
      width: '12%',
      render: (value) => value.slice(-8)
    },
    {
      key: 'title',
      label: '商品名称',
      width: '20%',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-slate-500">{row.subtitle}</div>
        </div>
      )
    },
    {
      key: 'base_price',
      label: '基础价格',
      width: '12%',
      render: (value) => `¥${value.toFixed(2)}`
    },
    {
      key: 'currentPrice',
      label: '今日价格',
      width: '12%',
      render: (value) => (
        <span className="text-green-700 font-medium">¥{value.toFixed(2)}</span>
      )
    },
    {
      key: 'tags',
      label: '标签',
      width: '18%',
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'created_at',
      label: '创建时间',
      width: '14%',
      render: (value) => value.slice(0, 16).replace('T', ' ')
    },
    {
      key: 'actions',
      label: '操作',
      width: '12%',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(row);
            }}
            className="p-1 text-blue-700 hover:bg-blue-50 rounded"
            title="编辑"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProduct(row.id);
            }}
            className="p-1 text-red-700 hover:bg-red-50 rounded"
            title="删除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="商品管理">
      {/* 提示信息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}
      {notice && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-600 mb-4">
          {notice}
        </div>
      )}

      {/* 添加商品按钮 */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm rounded hover:bg-green-800"
        >
          <Plus size={16} />
          添加商品
        </button>
      </div>

      {/* 商品列表 */}
      <DataTable columns={productColumns} data={products} emptyText="暂无商品" />

      {/* 添加商品弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-slate-800 mb-4">添加商品</h3>
            <div className="space-y-3">
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="商品名称"
              />
              <input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="商品副标题"
              />
              <input
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="基础价格"
                type="number"
              />

              {/* 图片上传区域 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">商品图片</label>

                {/* 图片预览 */}
                {imagePreview && (
                  <div className="relative w-full h-48 border-2 border-slate-200 rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="预览" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="删除图片"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {/* 上传按钮 */}
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded cursor-pointer hover:bg-blue-700">
                    <Upload size={16} />
                    {uploading ? '上传中...' : '选择图片'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </div>

                {/* URL输入 (可选) */}
                <div className="text-xs text-slate-500 text-center">或</div>
                <input
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="输入图片URL (可选)"
                />
              </div>

              <input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="标签 (逗号分隔)"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ title: '', subtitle: '', basePrice: '', image: '', tags: '' });
                  setImagePreview('');
                }}
                className="flex-1 bg-slate-200 text-slate-700 text-sm py-2 rounded hover:bg-slate-300"
              >
                取消
              </button>
              <button
                onClick={handleAddProduct}
                disabled={uploading}
                className="flex-1 bg-green-700 text-white text-sm py-2 rounded hover:bg-green-800 disabled:bg-slate-300"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑商品弹窗 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-slate-800 mb-4">编辑商品</h3>
            <div className="space-y-3">
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="商品名称"
              />
              <input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="商品副标题"
              />
              <input
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="基础价格"
                type="number"
              />

              {/* 图片上传区域 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">商品图片</label>

                {/* 图片预览 */}
                {imagePreview && (
                  <div className="relative w-full h-48 border-2 border-slate-200 rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="预览" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="删除图片"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {/* 上传按钮 */}
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded cursor-pointer hover:bg-blue-700">
                    <Upload size={16} />
                    {uploading ? '上传中...' : '选择图片'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </div>

                {/* URL输入 (可选) */}
                <div className="text-xs text-slate-500 text-center">或</div>
                <input
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="输入图片URL"
                />
              </div>

              <input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="标签 (逗号分隔)"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                  setFormData({ title: '', subtitle: '', basePrice: '', image: '', tags: '' });
                  setImagePreview('');
                }}
                className="flex-1 bg-slate-200 text-slate-700 text-sm py-2 rounded hover:bg-slate-300"
              >
                取消
              </button>
              <button
                onClick={handleEditProduct}
                disabled={uploading}
                className="flex-1 bg-green-700 text-white text-sm py-2 rounded hover:bg-green-800 disabled:bg-slate-300"
              >
                确认更新
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductManagement;
